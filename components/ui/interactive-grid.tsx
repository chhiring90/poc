"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

type Props = {
  gap?: number; // grid cell size (px)
  radius?: number; // wormhole influence radius (px)
  pull?: number; // 0..1 how hard the grid funnels into the hole
  swirl?: number; // radians of twist at the centre
  spider?: boolean; // show the radioactive spider
  spiderScale?: number; // 1 = ~85px leg span
  tear?: boolean; // cursor tears the web, spider repairs it
  className?: string;
};

const VERT = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Grid, light pulses and wormhole are all drawn in one fragment shader.
//  - every grid segment (node to node) can be torn: a data texture stores a
//    gap [a,b] (fraction along the segment) per segment. Strands taper off at
//    the gap and pulses can't travel across it.
//  - the spider repairs a gap by walking along it; the gap closes behind its
//    spinnerets.
const FRAG = /* glsl */ `
  precision highp float;

  uniform vec2  uRes;
  uniform vec2  uMouse;
  uniform float uDpr;
  uniform float uTime;
  uniform float uGap;
  uniform float uRadius;
  uniform float uPull;
  uniform float uSwirl;
  uniform float uHole;
  uniform float uPulse;
  uniform vec3  uGridColor;
  uniform vec3  uAccent;
  uniform vec3  uSpider;     // xy: abdomen position (css px, GL space), z: glow
  uniform sampler2D uWeb;    // per node: RG = horizontal gap, BA = vertical gap
  uniform vec2  uWebSize;

  #define N 14

  float hash(float n) { return fract(sin(n * 127.1) * 43758.5453123); }

  // visibility of a strand at position s (0..1) along its segment, given a
  // gap [a,b]. Strands taper off toward the gap.
  float strandVis(float s, float a, float b) {
    if (b <= a + 0.004) return 1.0;
    if (s <= a) return 1.0 - smoothstep(a - 0.12, a, s);
    if (s >= b) return smoothstep(b, b + 0.12, s);
    return 0.0;
  }

  void main() {
    vec2 p  = gl_FragCoord.xy / uDpr;
    vec2 d  = p - uMouse;
    float nd = length(d);

    // ---- wormhole: funnel + twist ----------------------------------------
    float t = clamp(1.0 - nd / uRadius, 0.0, 1.0);
    float s = t * t * (3.0 - 2.0 * t) * uHole;
    float srcD = nd * (1.0 + 4.0 * uPull * s);
    float ang = uSwirl * s * s;
    float c = cos(ang), sn = sin(ang);
    vec2 dir = nd > 0.0001 ? d / nd : vec2(1.0, 0.0);
    vec2 rd = vec2(dir.x * c - dir.y * sn, dir.x * sn + dir.y * c);
    vec2 sp = uMouse + rd * srcD;

    // ---- anti-aliased grid with tearable segments -------------------------
    vec2 g  = sp / uGap;
    vec2 fw = max(fwidth(g), vec2(1e-4));
    vec2 a  = abs(fract(g - 0.5) - 0.5) / fw;
    float lineV = 1.0 - min(a.x, 1.0);   // vertical strands
    float lineH = 1.0 - min(a.y, 1.0);   // horizontal strands

    vec4 tv = texture2D(uWeb, (vec2(floor(g.x + 0.5), floor(g.y)) + 0.5) / uWebSize);
    vec4 th = texture2D(uWeb, (vec2(floor(g.x), floor(g.y + 0.5)) + 0.5) / uWebSize);
    float visV = strandVis(fract(g.y), tv.b, tv.a);
    float visH = strandVis(fract(g.x), th.r, th.g);

    float line = max(lineV * visV, lineH * visH);
    float dens = max(fw.x, fw.y);
    float fade = 1.0 - smoothstep(0.25, 0.6, dens);

    // ---- light pulses -----------------------------------------------------
    float Ec = 0.0;   // hot, tight energy (core, head, sparks)
    float Eh = 0.0;   // wide, soft energy (halo / bloom)
    float lit = 0.0;  // how strongly this spot lights the grid lines

    for (int i = 0; i < N; i++) {
      float fi = float(i);
      bool vert = mod(fi, 2.0) < 1.0;
      float extent = vert ? uRes.y : uRes.x;
      float len    = 100.0 + hash(fi + 1.0) * 140.0;
      float speed  = 220.0 + hash(fi + 2.0) * 360.0;
      float total  = extent + 2.0 * len;
      float period = total / speed;
      float ph  = uTime / period + hash(fi + 3.0) * 10.0;
      float cyc = floor(ph);
      float fr  = fract(ph);
      float seed = fi + cyc * 17.0;

      float lines = floor((vert ? uRes.x : uRes.y) / uGap) + 1.0;
      float li  = floor(hash(seed + 4.0) * lines);
      bool fwd  = hash(fi + 5.0) > 0.5;

      float head = fr * total - len;
      float sgn = 1.0;
      if (!fwd) { head = extent - head; sgn = -1.0; }

      float along  = vert ? sp.y : sp.x;
      float across = vert ? sp.x : sp.y;
      float delta  = (head - along) * sgn;               // >0 behind the head
      float dist   = abs(across - li * uGap);
      float w      = max((vert ? fw.x : fw.y) * uGap, 0.75);  // src px per screen px
      float vv     = vert ? visV : visH;                 // light can't cross a tear

      float flick  = 1.0 + 0.08 * sin(uTime * 37.0 + fi * 7.3);
      float behind = max(delta, 0.0);

      // exponential comet tail, fading out at its far end
      float body = delta > 0.0
        ? exp(-behind / (len * 0.30)) * (1.0 - smoothstep(len * 0.7, len, behind))
        : 0.0;

      // across the line: sharp core + long Lorentzian halo
      float lineCore = exp(-pow(dist / (w * 0.9), 2.0));
      float lineHalo = 1.0 / (1.0 + pow(dist / (w * 4.0), 2.0));

      // the head is a point light radiating in 2D
      float r2 = delta * delta + dist * dist;
      float R0 = 12.0 * w;
      float headCore  = exp(-r2 / (R0 * R0 * 0.35));
      float headBloom = 1.0 / (1.0 + r2 / (R0 * R0 * 1.5));
      float spill     = 1.0 / (1.0 + r2 / (3025.0));      // ~55px reach

      Ec += (lineCore * body * 0.9 + headCore * 1.6) * flick * vv;
      Eh += (lineHalo * body * 0.18 + headBloom * 0.35) * flick * vv;
      lit += (spill * 0.55 + lineCore * body * 0.5) * vv;

      // sparks where the pulse crosses perpendicular grid lines
      float ac = abs(fract(along / uGap + 0.5) - 0.5) * uGap;
      float spark = exp(-(dist * dist + ac * ac) / (w * w * 9.0));
      if (delta > 0.0) Ec += spark * exp(-behind / (len * 0.18)) * 1.2 * vv;
    }

    float pulseFade = (1.0 - smoothstep(0.35, 0.9, dens)) * uPulse;
    float E = (Ec + Eh) * pulseFade;
    lit = clamp(lit * uPulse, 0.0, 1.0);

    // ---- cursor core + event-horizon ring --------------------------------
    float coreGlow = exp(-pow(nd / (uRadius * 0.28), 2.0)) * 0.25 * uHole;
    float ringR = 7.0 + 3.0 * sin(uTime * 3.3);
    float ring = exp(-pow((nd - ringR) / 1.2, 2.0)) * 0.7 * uHole;
    E += coreGlow + ring;

    // ---- radioactive glow from the spider's abdomen ----------------------
    const vec3 SPIDER_GREEN = vec3(0.28, 1.0, 0.16);
    float sd = length(p - uSpider.xy);
    float sg = uSpider.z * exp(-(sd * sd) / 14400.0);   // ~120px reach

    // ---- compose ----------------------------------------------------------
    float gridA = line * fade * (0.12 + 0.55 * lit + 0.9 * sg);
    vec3 gridCol = mix(uGridColor, uAccent, clamp(lit * 1.5, 0.0, 1.0));
    gridCol = mix(gridCol, SPIDER_GREEN, clamp(sg * 1.6, 0.0, 1.0));
    vec3 gridRGB = gridCol * gridA;

    vec3 glow = 1.0 - exp(-uAccent * E * 1.6);

    vec3 rgb = min(gridRGB + glow + SPIDER_GREEN * sg * 0.04, vec3(1.0));
    float alpha = max(max(rgb.r, max(rgb.g, rgb.b)), gridA);

    // dither to avoid banding in soft glows
    float dn = fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    rgb += step(0.002, alpha) * (dn - 0.5) / 255.0;

    gl_FragColor = vec4(min(rgb, vec3(alpha)), alpha);
  }
`;

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const TAU = Math.PI * 2;
const angDiff = (a: number, b: number) => {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
};

/* ============================================================================
   Web: per-segment tear state, mirrored into a data texture for the shader
   ========================================================================= */
class Web {
  readonly gap: number;
  cols = 0;
  rows = 0;
  TW = 2;
  TH = 2;
  a = new Float32Array(0); // gap start (0..1 along the segment)
  b = new Float32Array(0); // gap end
  stress = new Float32Array(0);
  resist = new Float32Array(0);
  center = new Float32Array(0);
  data = new Uint8Array(16);
  tex: THREE.DataTexture;
  broken = new Set<number>();
  repairing = new Set<number>();
  dirty = false;

  constructor(gap: number) {
    this.gap = gap;
    this.tex = this.makeTex();
  }

  private makeTex() {
    const t = new THREE.DataTexture(
      this.data,
      this.TW,
      this.TH,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
    );
    t.minFilter = THREE.NearestFilter;
    t.magFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    return t;
  }

  resize(W: number, H: number) {
    const cols = Math.floor(W / this.gap);
    const rows = Math.floor(H / this.gap);
    if (cols === this.cols && rows === this.rows && this.a.length) return false;
    this.cols = cols;
    this.rows = rows;
    this.TW = cols + 2;
    this.TH = rows + 2;
    const n = this.TW * this.TH * 2;
    this.a = new Float32Array(n);
    this.b = new Float32Array(n);
    this.stress = new Float32Array(n);
    this.resist = new Float32Array(n);
    this.center = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      this.resist[k] = 0.8 + Math.random() * 0.6;
      this.center[k] = 0.5 + (Math.random() - 0.5) * 0.24;
    }
    this.data = new Uint8Array(this.TW * this.TH * 4);
    this.broken.clear();
    this.repairing.clear();
    this.tex.dispose();
    this.tex = this.makeTex();
    this.dirty = false;
    return true;
  }

  // o: 0 = horizontal segment (i,j)->(i+1,j), 1 = vertical (i,j)->(i,j+1)
  id(i: number, j: number, o: number) {
    return (j * this.TW + i) * 2 + o;
  }
  decode(id: number) {
    const o = id & 1;
    const p = id >> 1;
    const i = p % this.TW;
    return { i, j: (p - i) / this.TW, o };
  }
  valid(i: number, j: number, o: number) {
    if (i < 0 || j < 0) return false;
    return o === 0
      ? i < this.cols && j <= this.rows
      : i <= this.cols && j < this.rows;
  }
  isTorn(id: number) {
    return this.b[id] > this.a[id] + 0.004;
  }

  private write(id: number) {
    const p = (id >> 1) * 4 + (id & 1) * 2;
    this.data[p] = Math.round(clamp(this.a[id], 0, 1) * 255);
    this.data[p + 1] = Math.round(clamp(this.b[id], 0, 1) * 255);
    this.dirty = true;
  }

  // the cursor stresses nearby segments until they snap
  tear(mx: number, my: number, hole: number, dt: number, radius: number) {
    if (hole < 0.05 || dt <= 0) return;
    const gap = this.gap;
    const R = radius * 0.6;
    const i0 = Math.max(0, Math.floor((mx - R) / gap) - 1);
    const i1 = Math.min(this.cols, Math.ceil((mx + R) / gap) + 1);
    const j0 = Math.max(0, Math.floor((my - R) / gap) - 1);
    const j1 = Math.min(this.rows, Math.ceil((my + R) / gap) + 1);
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        for (let o = 0; o < 2; o++) {
          if (!this.valid(i, j, o)) continue;
          const id = this.id(i, j, o);
          if (this.repairing.has(id)) continue;
          const cx = o === 0 ? (i + 0.5) * gap : i * gap;
          const cy = o === 0 ? j * gap : (j + 0.5) * gap;
          const d = Math.hypot(cx - mx, cy - my);
          if (d >= R) continue;
          const k = 1 - d / R;
          this.stress[id] += (k * k * hole * dt * 1.1) / this.resist[id];
          const w = clamp((this.stress[id] - 0.35) / 0.45, 0, 1) * 0.7;
          if (w > 0) {
            const c = this.center[id];
            const na = c - w / 2;
            const nb = c + w / 2;
            if (na !== this.a[id] || nb !== this.b[id]) {
              this.a[id] = na;
              this.b[id] = nb;
              this.write(id);
            }
            this.broken.add(id);
          }
        }
      }
    }
  }

  // spider laid silk up to fraction f from `fromEnd`; returns true when closed
  applyRepair(id: number, fromEnd: 0 | 1, f: number) {
    if (fromEnd === 0) this.a[id] = Math.max(this.a[id], f);
    else this.b[id] = Math.min(this.b[id], 1 - f);
    if (this.b[id] - this.a[id] <= 0.012) {
      this.a[id] = 0;
      this.b[id] = 0;
      this.stress[id] = 0;
      this.resist[id] = 0.8 + Math.random() * 0.6;
      this.center[id] = 0.5 + (Math.random() - 0.5) * 0.24;
      this.broken.delete(id);
      this.repairing.delete(id);
      this.write(id);
      return true;
    }
    this.write(id);
    return false;
  }

  flush() {
    if (this.dirty) {
      this.tex.needsUpdate = true;
      this.dirty = false;
    }
  }
}

/* ============================================================================
   Radioactive spider
   - walks along the grid lines, pausing, turning at intersections and
     scurrying away from the cursor
   - when the cursor has torn the web it walks to the break (routing around
     torn strands), then crosses it spinning new silk behind its spinnerets
   - 8 legs with 2-bone IK and an alternating-tetrapod gait
   - translucent glowing green abdomen that pulses and lights the grid
   ========================================================================= */

const L1 = 26; // upper leg segment (in body units; multiplied by scale)
const L2 = 30; // lower leg segment

// attach offset along the body, and rest-foot position (forward, lateral)
const LEG_DEFS = [
  { a: 5, rest: [30, 30] },
  { a: 2, rest: [17, 42] },
  { a: -1.5, rest: [-9, 44] },
  { a: -4.5, rest: [-32, 36] },
];

type Leg = {
  side: number; // -1 left, +1 right
  group: number; // gait group 0/1 (diagonal pairs move together)
  ai: number; // attach (forward)
  ab: number; // attach (lateral)
  ri: number; // rest (forward)
  rb: number; // rest (lateral)
  fx: number;
  fy: number; // current foot, world
  x0: number;
  y0: number;
  x1: number;
  y1: number; // step from / to
  stepping: boolean;
  t: number;
  dur: number;
  lift: number;
};

type Cursor = { x: number; y: number; active: boolean };
type Repair = {
  id: number;
  fromEnd: 0 | 1;
  f: number;
  target: number;
  dead: boolean;
};
type Mode = "wander" | "goto" | "repair";

class Spider {
  readonly S: number;
  readonly gap: number;
  readonly web: Web;
  W = 0;
  H = 0;
  cols = 0;
  rows = 0;
  ready = false;

  // grid navigation (node indices; y index counts upward like the shader grid)
  fi = 0;
  fj = 0;
  ti = 0;
  tj = 0;
  u = 0;

  // repair behaviour
  mode: Mode = "wander";
  path: [number, number][] = [];
  plan = -1;
  rep: Repair | null = null;
  repairs: Repair[] = [];
  cooldown = 0;

  // pose
  x = 0;
  y = 0;
  heading = 0;
  hd = 0; // heading incl. gait wobble
  abd = 0; // abdomen angle (lags behind)
  bx = 0;
  by = 0; // body centre incl. sway
  cf = 1;
  sf = 0;

  speed = 0;
  speedMul = 1;
  phase = 0;
  t = 0;
  pause = 0;
  revCd = 0;
  twitch = 2;

  glow = 1;
  glowX = 0;
  glowY = 0;

  legs: Leg[] = [];
  private prev: { x: number; y: number; w: number; h: number } | null = null;

  constructor(S: number, gap: number, web: Web) {
    this.S = S;
    this.gap = gap;
    this.web = web;
    for (let k = 0; k < LEG_DEFS.length; k++) {
      for (const side of [-1, 1]) {
        const def = LEG_DEFS[k];
        this.legs.push({
          side,
          group: (k + (side > 0 ? 1 : 0)) % 2,
          ai: def.a,
          ab: side * 5,
          ri: def.rest[0],
          rb: side * def.rest[1],
          fx: 0,
          fy: 0,
          x0: 0,
          y0: 0,
          x1: 0,
          y1: 0,
          stepping: false,
          t: 0,
          dur: 0.2,
          lift: 0,
        });
      }
    }
  }

  nodeX(i: number) {
    return i * this.gap;
  }
  nodeY(j: number) {
    return this.H - j * this.gap;
  }

  resetClear() {
    this.prev = null;
  }

  setBounds(W: number, H: number) {
    const oldCols = this.cols;
    const oldRows = this.rows;
    this.W = W;
    this.H = H;
    this.cols = Math.floor(W / this.gap);
    this.rows = Math.floor(H / this.gap);
    if (this.cols < 5 || this.rows < 5) {
      this.ready = false;
      return;
    }
    if (oldCols !== this.cols || oldRows !== this.rows) this.abortPlan();
    const outside =
      this.fi < 0 ||
      this.fi > this.cols ||
      this.fj < 0 ||
      this.fj > this.rows ||
      this.ti < 0 ||
      this.ti > this.cols ||
      this.tj < 0 ||
      this.tj > this.rows;
    if (!this.ready || outside) {
      const ri = (lo: number, hi: number) =>
        lo + Math.floor(Math.random() * (hi - lo + 1));
      this.fi = ri(2, this.cols - 3);
      this.fj = ri(2, this.rows - 3);
      this.ti = this.fi + 1;
      this.tj = this.fj;
      this.u = 0.3;
      this.updatePosition();
      this.heading = this.hd = this.abd = 0;
      this.setFrame(this.x, this.y);
      this.placeFeet();
      this.ready = true;
    }
  }

  private updatePosition() {
    const x0 = this.nodeX(this.fi);
    const y0 = this.nodeY(this.fj);
    const x1 = this.nodeX(this.ti);
    const y1 = this.nodeY(this.tj);
    this.x = x0 + (x1 - x0) * this.u;
    this.y = y0 + (y1 - y0) * this.u;
  }

  private setFrame(bx: number, by: number) {
    this.bx = bx;
    this.by = by;
    this.cf = Math.cos(this.hd);
    this.sf = Math.sin(this.hd);
  }

  // body-local (forward a, lateral b) in body units -> world
  private world(a: number, b: number) {
    const S = this.S;
    return {
      x: this.bx + this.cf * a * S - this.sf * b * S,
      y: this.by + this.sf * a * S + this.cf * b * S,
    };
  }

  private placeFeet() {
    for (const leg of this.legs) {
      const r = this.world(leg.ri, leg.rb);
      leg.fx = r.x;
      leg.fy = r.y;
      leg.stepping = false;
      leg.lift = 0;
    }
  }

  // ---------------------------------------------------------------- web AI
  private edgeId(ci: number, cj: number, ni: number, nj: number) {
    if (ni === ci + 1) return this.web.id(ci, cj, 0);
    if (ni === ci - 1) return this.web.id(ni, cj, 0);
    if (nj === cj + 1) return this.web.id(ci, cj, 1);
    return this.web.id(ci, nj, 1);
  }

  private abortPlan() {
    this.mode = "wander";
    this.path = [];
    this.plan = -1;
    if (this.rep) {
      this.rep.dead = true;
      this.web.repairing.delete(this.rep.id);
      this.rep = null;
    }
  }

  private bfs(si: number, sj: number, avoidTorn: boolean) {
    const cols = this.web.cols;
    const rows = this.web.rows;
    const NW = cols + 1;
    const N = NW * (rows + 1);
    const dist = new Int32Array(N).fill(-1);
    const prev = new Int32Array(N).fill(-1);
    const q = new Int32Array(N);
    let qh = 0;
    let qt = 0;
    const s = sj * NW + si;
    dist[s] = 0;
    q[qt++] = s;
    while (qh < qt) {
      const n = q[qh++];
      const i = n % NW;
      const j = (n - i) / NW;
      const tryN = (ni: number, nj: number, id: number) => {
        if (ni < 0 || ni > cols || nj < 0 || nj > rows) return;
        if (avoidTorn && this.web.isTorn(id)) return;
        const m = nj * NW + ni;
        if (dist[m] !== -1) return;
        dist[m] = dist[n] + 1;
        prev[m] = n;
        q[qt++] = m;
      };
      tryN(i + 1, j, this.web.id(i, j, 0));
      tryN(i - 1, j, this.web.id(i - 1, j, 0));
      tryN(i, j + 1, this.web.id(i, j, 1));
      tryN(i, j - 1, this.web.id(i, j - 1, 1));
    }
    return { dist, prev };
  }

  // pick the nearest broken segment and route to one of its ends
  private planRepair(si: number, sj: number) {
    const web = this.web;
    const cand: number[] = [];
    web.broken.forEach((id) => {
      if (!web.repairing.has(id)) cand.push(id);
    });
    if (!cand.length) return false;
    const NW = web.cols + 1;

    for (const avoid of [true, false]) {
      const { dist, prev } = this.bfs(si, sj, avoid);
      let best = -1;
      let bestEnd = -1;
      let bestD = 1e9;
      for (const id of cand) {
        const { i, j, o } = web.decode(id);
        const e0 = j * NW + i;
        const e1 = o === 0 ? j * NW + i + 1 : (j + 1) * NW + i;
        for (const e of [e0, e1]) {
          const d = dist[e];
          if (d >= 0 && d < bestD) {
            bestD = d;
            best = id;
            bestEnd = e;
          }
        }
      }
      if (best >= 0) {
        const s = sj * NW + si;
        const arr: [number, number][] = [];
        let n = bestEnd;
        while (n !== s && n >= 0) {
          arr.push([n % NW, Math.floor(n / NW)]);
          n = prev[n];
        }
        arr.reverse();
        this.plan = best;
        this.path = arr;
        return true;
      }
    }
    return false;
  }

  // we're standing on one end of the plan's segment: start crossing it
  private beginRepair(ni: number, nj: number) {
    const web = this.web;
    const { i, j, o } = web.decode(this.plan);
    const e1: [number, number] = o === 0 ? [i + 1, j] : [i, j + 1];
    let fromEnd: 0 | 1;
    let other: [number, number];
    if (ni === i && nj === j) {
      fromEnd = 0;
      other = e1;
    } else {
      fromEnd = 1;
      other = [i, j];
    }
    this.fi = ni;
    this.fj = nj;
    this.ti = other[0];
    this.tj = other[1];
    this.mode = "repair";
    this.pause = 0;
    const rep: Repair = {
      id: this.plan,
      fromEnd,
      f: 0,
      target: 0,
      dead: false,
    };
    this.rep = rep;
    this.repairs.push(rep);
    web.repairing.add(this.plan);
  }

  private chooseNext(cur: Cursor, flee: boolean) {
    const ci = this.ti;
    const cj = this.tj;
    const pi = this.ti - this.fi;
    const pj = this.tj - this.fj;
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const build = (skipTorn: boolean) => {
      const out: { i: number; j: number; w: number }[] = [];
      for (const [di, dj] of dirs) {
        const ni = ci + di;
        const nj = cj + dj;
        if (ni < 1 || ni > this.cols - 1 || nj < 1 || nj > this.rows - 1)
          continue;
        if (skipTorn && this.web.isTorn(this.edgeId(ci, cj, ni, nj))) continue;
        const straight = di === pi && dj === pj;
        const rev = di === -pi && dj === -pj;
        let w = straight ? 0.55 : rev ? 0 : 0.225;
        if (flee) {
          const d = Math.hypot(this.nodeX(ni) - cur.x, this.nodeY(nj) - cur.y);
          w = d * d * (rev ? 0.35 : 1);
        }
        out.push({ i: ni, j: nj, w });
      }
      return out;
    };
    let cands = build(true);
    if (!cands.length) cands = build(false);
    let total = cands.reduce((s, c) => s + c.w, 0);
    if (total <= 0) {
      cands.forEach((c) => (c.w = 1));
      total = cands.length;
    }
    let roll = Math.random() * total;
    let pick = cands[0];
    for (const c of cands) {
      roll -= c.w;
      if (roll <= 0) {
        pick = c;
        break;
      }
    }
    this.fi = ci;
    this.fj = cj;
    this.ti = pick.i;
    this.tj = pick.j;
    this.speedMul = 0.75 + Math.random() * 0.5;
    if (!flee && Math.random() < 0.18) this.pause = 0.8 + Math.random() * 2.2;
  }

  // reached a node: decide what to do next
  private arrive(cur: Cursor, flee: boolean) {
    const ni = this.ti;
    const nj = this.tj;

    if (this.mode === "repair" && this.rep) {
      this.rep.target = 1; // silk catches up to the end of the strand
      this.rep = null;
      this.mode = "wander";
      this.plan = -1;
    }

    if (!flee) {
      if (this.mode === "goto") {
        const nxt = this.path.shift();
        if (nxt) {
          this.fi = ni;
          this.fj = nj;
          this.ti = nxt[0];
          this.tj = nxt[1];
        } else {
          this.beginRepair(ni, nj);
        }
        return;
      }
      if (
        this.mode === "wander" &&
        this.cooldown <= 0 &&
        this.web.broken.size > 0
      ) {
        if (this.planRepair(ni, nj)) {
          this.mode = "goto";
          const nxt = this.path.shift();
          if (nxt) {
            this.fi = ni;
            this.fj = nj;
            this.ti = nxt[0];
            this.tj = nxt[1];
          } else {
            this.beginRepair(ni, nj);
          }
          return;
        }
      }
    }
    this.chooseNext(cur, flee);
  }

  update(dt: number, cur: Cursor) {
    if (!this.ready) return;
    const S = this.S;
    const gap = this.gap;
    this.t += dt;
    this.revCd = Math.max(0, this.revCd - dt);
    if (cur.active) this.cooldown = 1.2;
    else this.cooldown = Math.max(0, this.cooldown - dt);

    let x0 = this.nodeX(this.fi);
    let y0 = this.nodeY(this.fj);
    let x1 = this.nodeX(this.ti);
    let y1 = this.nodeY(this.tj);
    let dx = x1 - x0;
    let dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;

    // ---- scared of the cursor ----
    let flee = false;
    if (cur.active) {
      const cx = cur.x - this.x;
      const cy = cur.y - this.y;
      const cd = Math.hypot(cx, cy);
      if (cd < 210) {
        flee = true;
        this.pause = 0;
        if (this.mode !== "wander") this.abortPlan();
        if (cd < 150 && cx * dx + cy * dy > 0 && this.revCd === 0) {
          // cursor is ahead: turn back along the same strand
          [this.fi, this.ti] = [this.ti, this.fi];
          [this.fj, this.tj] = [this.tj, this.fj];
          this.u = 1 - this.u;
          dx = -dx;
          dy = -dy;
          this.revCd = 0.6;
        }
      }
    }

    // ---- speed + steering ----
    const target =
      this.pause > 0
        ? 0
        : flee
          ? 230 * S
          : this.mode === "repair"
            ? 48 * S
            : this.mode === "goto"
              ? 105 * S
              : 70 * S * this.speedMul;
    this.speed += (target - this.speed) * Math.min(1, dt * (flee ? 9 : 3.5));
    if (this.pause > 0) this.pause -= dt;

    const desired = Math.atan2(dy, dx);
    const turnRate = flee ? 10 : 4.5;
    const err0 = angDiff(this.heading, desired);
    this.heading += clamp(err0, -turnRate * dt, turnRate * dt);
    const err = angDiff(this.heading, desired);
    const align = Math.pow(Math.max(0, Math.cos(err)), 1.5);
    const eff = this.speed * align;

    this.u += (eff * dt) / len;
    if (this.u >= 1) {
      const carry = this.u - 1;
      this.arrive(cur, flee);
      this.u = carry;
    }
    this.updatePosition();
    void x0;
    void y0;
    void x1;
    void y1;

    // ---- spinning silk behind the spinnerets ----
    if (this.mode === "repair" && this.rep) {
      this.rep.target = clamp((this.u * gap - 31 * S) / gap, 0, 1);
    }
    for (let k = this.repairs.length - 1; k >= 0; k--) {
      const r = this.repairs[k];
      if (r.dead) {
        this.repairs.splice(k, 1);
        continue;
      }
      r.f = Math.min(r.target, r.f + (dt * 300) / gap);
      if (this.web.applyRepair(r.id, r.fromEnd, r.f)) this.repairs.splice(k, 1);
    }

    // ---- gait-driven body motion ----
    const walk = clamp(eff / (70 * S), 0, 1.6);
    this.phase += (eff * dt) / (7 * S);
    this.hd =
      this.heading + 0.045 * Math.sin(this.phase + 1) * Math.min(walk, 1);
    const cf = Math.cos(this.hd);
    const sf = Math.sin(this.hd);
    const sway = Math.sin(this.phase) * 0.9 * S * Math.min(walk, 1);
    this.setFrame(this.x - sf * sway, this.y + cf * sway);

    // abdomen swings with a slight lag, like a real weight on a stalk
    this.abd += angDiff(this.abd, this.hd) * Math.min(1, dt * 5);

    this.updateLegs(dt, dx * eff, dy * eff, eff);

    // glow position + pulse (brighter while spinning silk)
    const px = this.bx - this.cf * 8 * S;
    const py = this.by - this.sf * 8 * S;
    this.glowX = px - Math.cos(this.abd) * 11 * S;
    this.glowY = py - Math.sin(this.abd) * 11 * S;
    this.glow =
      (flee ? 1.15 : this.mode === "repair" ? 1.2 : 1) *
      (0.88 + 0.12 * Math.sin(this.t * 2.3) + 0.04 * Math.sin(this.t * 19));
  }

  private startStep(
    leg: Leg,
    rest: { x: number; y: number },
    att: { x: number; y: number },
    vx: number,
    vy: number,
    dur: number,
  ) {
    const S = this.S;
    let tx = rest.x + vx * dur * 0.9 + (Math.random() - 0.5) * 1.2 * S;
    let ty = rest.y + vy * dur * 0.9 + (Math.random() - 0.5) * 1.2 * S;
    const maxR = (L1 + L2) * S * 0.92;
    const rx = tx - att.x;
    const ry = ty - att.y;
    const rl = Math.hypot(rx, ry);
    if (rl > maxR) {
      tx = att.x + (rx / rl) * maxR;
      ty = att.y + (ry / rl) * maxR;
    }
    leg.x0 = leg.fx;
    leg.y0 = leg.fy;
    leg.x1 = tx;
    leg.y1 = ty;
    leg.t = 0;
    leg.dur = dur;
    leg.stepping = true;
  }

  private updateLegs(dt: number, vx: number, vy: number, speed: number) {
    const S = this.S;
    const maxReach = (L1 + L2) * S * 0.97;
    const stepping = [false, false];
    for (const l of this.legs) if (l.stepping) stepping[l.group] = true;
    const dur = clamp((12.6 * S) / (speed + 1), 0.08, 0.3);

    for (const leg of this.legs) {
      if (leg.stepping) {
        leg.t += dt / leg.dur;
        const k = Math.min(leg.t, 1);
        const e = k * k * (3 - 2 * k);
        leg.fx = leg.x0 + (leg.x1 - leg.x0) * e;
        leg.fy = leg.y0 + (leg.y1 - leg.y0) * e;
        leg.lift = Math.sin(Math.PI * k);
        if (leg.t >= 1) {
          leg.stepping = false;
          leg.lift = 0;
        }
        continue;
      }
      const rest = this.world(leg.ri, leg.rb);
      const att = this.world(leg.ai, leg.ab);
      const d = Math.hypot(leg.fx - rest.x, leg.fy - rest.y);
      const reach = Math.hypot(leg.fx - att.x, leg.fy - att.y);
      if ((d > 14 * S && !stepping[1 - leg.group]) || reach > maxReach) {
        this.startStep(leg, rest, att, vx, vy, dur);
        stepping[leg.group] = true;
      }
    }

    // idle fidgeting: a random leg re-settles now and then
    this.twitch -= dt;
    if (this.twitch <= 0 && speed < 10 && !stepping[0] && !stepping[1]) {
      const leg = this.legs[Math.floor(Math.random() * this.legs.length)];
      const rest = this.world(leg.ri, leg.rb);
      const att = this.world(leg.ai, leg.ab);
      this.startStep(leg, rest, att, 0, 0, 0.22);
      this.twitch = 1.2 + Math.random() * 2.5;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.ready) return;
    const S = this.S;
    const m = 135 * S;

    // clear only where the spider was and is now
    if (this.prev)
      ctx.clearRect(this.prev.x, this.prev.y, this.prev.w, this.prev.h);
    const rect = {
      x: Math.floor(this.bx - m) - 2,
      y: Math.floor(this.by - m) - 2,
      w: Math.ceil(2 * m) + 4,
      h: Math.ceil(2 * m) + 4,
    };
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
    this.prev = rect;

    // soft contact shadow
    {
      const sx = this.bx + 3 * S;
      const sy = this.by + 5 * S;
      const sh = ctx.createRadialGradient(sx, sy, 0, sx, sy, 32 * S);
      sh.addColorStop(0, "rgba(0,0,0,0.30)");
      sh.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.arc(sx, sy, 32 * S, 0, TAU);
      ctx.fill();
    }

    this.drawLegs(ctx);

    // pedicel (waist)
    ctx.fillStyle = "#120f0c";
    ctx.beginPath();
    ctx.arc(
      this.bx - this.cf * 8 * S,
      this.by - this.sf * 8 * S,
      3 * S,
      0,
      TAU,
    );
    ctx.fill();

    this.drawAbdomen(ctx);
    this.drawThorax(ctx);

    // radioactive glow (additive) - also tints the nearby legs and thorax
    ctx.globalCompositeOperation = "lighter";
    const g = this.glow;
    const gx = this.glowX;
    const gy = this.glowY;
    const g1 = ctx.createRadialGradient(gx, gy, 0, gx, gy, 95 * S);
    g1.addColorStop(0, `rgba(70,255,50,${0.3 * g})`);
    g1.addColorStop(0.35, `rgba(50,230,40,${0.12 * g})`);
    g1.addColorStop(1, "rgba(30,200,30,0)");
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.arc(gx, gy, 95 * S, 0, TAU);
    ctx.fill();
    const g2 = ctx.createRadialGradient(gx, gy, 0, gx, gy, 26 * S);
    g2.addColorStop(0, `rgba(190,255,130,${0.28 * g})`);
    g2.addColorStop(1, "rgba(190,255,130,0)");
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(gx, gy, 26 * S, 0, TAU);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  private drawLegs(ctx: CanvasRenderingContext2D) {
    const S = this.S;
    const l1 = L1 * S;
    const l2 = L2 * S;
    type P = {
      ax: number;
      ay: number;
      kx: number;
      ky: number;
      fx: number;
      fy: number;
      lift: number;
    };
    const pts: P[] = [];

    for (const leg of this.legs) {
      const att = this.world(leg.ai, leg.ab);
      let dx = leg.fx - att.x;
      let dy = leg.fy - att.y;
      let dist = Math.hypot(dx, dy);
      const maxd = l1 + l2 - 0.01;
      if (dist > maxd) {
        dx *= maxd / dist;
        dy *= maxd / dist;
        dist = maxd;
      }
      if (dist < 0.5) dist = 0.5;
      const a = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist);
      const h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
      const ux = dx / dist;
      const uy = dy / dist;
      const mx = att.x + ux * a;
      const my = att.y + uy * a;
      const px = -uy;
      const py = ux;

      // knee bends outward (and a little forward on front legs, back on rear)
      const sgnA = leg.ri >= 0 ? 1 : -1;
      let ox = -this.sf * leg.side + this.cf * 0.3 * sgnA;
      let oy = this.cf * leg.side + this.sf * 0.3 * sgnA;
      const ol = Math.hypot(ox, oy) || 1;
      ox /= ol;
      oy /= ol;
      const s = px * ox + py * oy >= 0 ? 1 : -1;
      const kx = mx + px * h * s + ox * leg.lift * 4 * S;
      const ky = my + py * h * s + oy * leg.lift * 4 * S;

      pts.push({
        ax: att.x,
        ay: att.y,
        kx,
        ky,
        fx: att.x + ux * dist,
        fy: att.y + uy * dist,
        lift: leg.lift,
      });
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const strokeLeg = (p: P, ox: number, oy: number, color: string) => {
      const mx = p.kx + (p.fx - p.kx) * 0.7;
      const my = p.ky + (p.fy - p.ky) * 0.7;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.3 * S;
      ctx.beginPath();
      ctx.moveTo(p.ax + ox, p.ay + oy);
      ctx.lineTo(p.kx + ox, p.ky + oy);
      ctx.stroke();
      ctx.lineWidth = 2.3 * S;
      ctx.beginPath();
      ctx.moveTo(p.kx + ox, p.ky + oy);
      ctx.lineTo(mx + ox, my + oy);
      ctx.stroke();
      ctx.lineWidth = 1.1 * S;
      ctx.beginPath();
      ctx.moveTo(mx + ox, my + oy);
      ctx.lineTo(p.fx + ox, p.fy + oy);
      ctx.stroke();
    };

    // shadows (lifted legs cast a more offset shadow)
    for (const p of pts) {
      const k = 1 + p.lift * 0.8;
      strokeLeg(p, 3 * S * k, 4 * S * k, "rgba(0,0,0,0.20)");
    }
    // legs
    for (const p of pts) {
      strokeLeg(p, 0, 0, "#0c0a09");
      ctx.fillStyle = "#171310";
      ctx.beginPath();
      ctx.arc(p.kx, p.ky, 1.8 * S, 0, TAU);
      ctx.fill();
    }
  }

  private drawAbdomen(ctx: CanvasRenderingContext2D) {
    const S = this.S;
    const rx = 14 * S;
    const ry = 11.5 * S;

    ctx.save();
    ctx.translate(this.glowX, this.glowY);
    ctx.rotate(this.abd);
    ctx.scale(rx, ry);

    const path = () => {
      ctx.beginPath();
      ctx.moveTo(1, 0);
      ctx.bezierCurveTo(0.55, -0.95, -0.55, -1.15, -0.98, -0.25);
      ctx.bezierCurveTo(-1.08, -0.1, -1.08, 0.1, -0.98, 0.25);
      ctx.bezierCurveTo(-0.55, 1.15, 0.55, 0.95, 1, 0);
      ctx.closePath();
    };

    // translucent radioactive body: bright core, darker rim
    const gr = ctx.createRadialGradient(-0.1, 0, 0, -0.1, 0, 1.05);
    gr.addColorStop(0, "rgb(236,255,176)");
    gr.addColorStop(0.2, "rgb(158,255,72)");
    gr.addColorStop(0.5, "rgb(48,226,48)");
    gr.addColorStop(0.8, "rgb(12,112,38)");
    gr.addColorStop(1, "rgb(3,40,16)");
    path();
    ctx.fillStyle = gr;
    ctx.fill();

    // markings + pulsing inner light, clipped to the abdomen
    ctx.save();
    path();
    ctx.clip();
    ctx.fillStyle = "rgba(2,48,12,0.32)";
    for (let k = 0; k < 4; k++) {
      ctx.beginPath();
      ctx.ellipse(0.45 - k * 0.42, 0, 0.11, 0.3 - k * 0.04, 0, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(2,48,12,0.18)";
    for (const sd of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(-0.1, sd * 0.62, 0.7, 0.07, sd * 0.15, 0, TAU);
      ctx.fill();
    }
    const ig = ctx.createRadialGradient(-0.25, 0, 0, -0.25, 0, 0.7);
    ig.addColorStop(0, `rgba(210,255,150,${0.35 * this.glow})`);
    ig.addColorStop(1, "rgba(210,255,150,0)");
    ctx.fillStyle = ig;
    ctx.fillRect(-1.2, -1.2, 2.4, 2.4);
    ctx.restore();

    // wet specular highlight + rim light
    ctx.fillStyle = "rgba(255,255,255,0.20)";
    ctx.beginPath();
    ctx.ellipse(0.25, -0.5, 0.38, 0.11, -0.25, 0, TAU);
    ctx.fill();
    path();
    ctx.lineWidth = 0.07;
    ctx.strokeStyle = "rgba(190,255,150,0.35)";
    ctx.stroke();
    ctx.restore();

    // spinnerets
    ctx.fillStyle = "#0b1a0d";
    ctx.beginPath();
    ctx.arc(
      this.glowX - Math.cos(this.abd) * rx * 0.98,
      this.glowY - Math.sin(this.abd) * rx * 0.98,
      1.4 * S,
      0,
      TAU,
    );
    ctx.fill();
  }

  private drawThorax(ctx: CanvasRenderingContext2D) {
    const S = this.S;
    ctx.save();
    ctx.translate(this.bx, this.by);
    ctx.rotate(this.hd);

    // cephalothorax: faint green rim light on the side facing the abdomen
    const tg = ctx.createLinearGradient(-10 * S, 0, 12 * S, 0);
    tg.addColorStop(0, "#2d4a24");
    tg.addColorStop(0.35, "#1a1612");
    tg.addColorStop(1, "#0d0a08");
    ctx.fillStyle = tg;
    ctx.beginPath();
    ctx.ellipse(-1.5 * S, 0, 8.5 * S, 7 * S, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6.5 * S, 0, 5.2 * S, 4.6 * S, 0, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.ellipse(0, -2 * S, 5 * S, 1.6 * S, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = 0.8 * S;
    ctx.beginPath();
    ctx.moveTo(-5 * S, 0);
    ctx.lineTo(2 * S, 0);
    ctx.stroke();

    // pedipalps (twitching) + chelicerae
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const side of [-1, 1]) {
      const wig = Math.sin(this.t * 6 + side * 1.7) * 0.8 * S;
      ctx.strokeStyle = "#15110e";
      ctx.lineWidth = 1.5 * S;
      ctx.beginPath();
      ctx.moveTo(9.5 * S, side * 3 * S);
      ctx.lineTo(13 * S, side * (5 * S + wig));
      ctx.lineTo(16 * S, side * (3.5 * S + wig * 0.5));
      ctx.stroke();

      ctx.fillStyle = "#1a1512";
      ctx.beginPath();
      ctx.ellipse(11 * S, side * 1.8 * S, 2.2 * S, 1.3 * S, 0, 0, TAU);
      ctx.fill();
    }

    // eyes with a faint green glint
    const eyes: [number, number, number][] = [
      [9.6, 1.5, 1.0],
      [9.6, -1.5, 1.0],
      [8.6, 3.0, 0.7],
      [8.6, -3.0, 0.7],
      [7.2, 3.5, 0.55],
      [7.2, -3.5, 0.55],
    ];
    for (const [ex, ey, er] of eyes) {
      ctx.fillStyle = "#040302";
      ctx.beginPath();
      ctx.arc(ex * S, ey * S, er * S, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "rgba(125,255,90,0.6)";
      ctx.beginPath();
      ctx.arc((ex + 0.25) * S, (ey - 0.25) * S, er * 0.32 * S, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }
}

type GL = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  uniforms: Record<string, THREE.IUniform>;
  web: Web;
  spider: Spider | null;
  octx: CanvasRenderingContext2D | null;
};

export function InteractiveGrid({
  gap = 40,
  radius = 150,
  pull = 0.9,
  swirl = 0.1,
  spider = true,
  spiderScale = 0.45,
  tear = false,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spiderCanvasRef = useRef<HTMLCanvasElement>(null);
  const primaryRef = useRef<HTMLSpanElement>(null);
  const gl = useRef<GL | null>(null);

  const reduced = useReducedMotion();
  const inView = useInView(wrapRef);

  // Motion drives the smoothing: raw pointer -> springs -> uniforms
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const holeTarget = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 140, damping: 22, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 140, damping: 22, mass: 0.4 });
  const hole = useSpring(holeTarget, { stiffness: 90, damping: 20 });

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const oc = spiderCanvasRef.current;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // no WebGL -> just no effect
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    // 1x1 canvas to turn any CSS colour (oklch, hsl, var...) into sRGB
    const probe = document.createElement("canvas");
    probe.width = probe.height = 1;
    const pctx = probe.getContext("2d", { willReadFrequently: true })!;
    const cssToVec = (css: string, out: THREE.Vector3) => {
      pctx.clearRect(0, 0, 1, 1);
      pctx.fillStyle = "#000";
      pctx.fillStyle = css;
      pctx.fillRect(0, 0, 1, 1);
      const d = pctx.getImageData(0, 0, 1, 1).data;
      out.set(d[0] / 255, d[1] / 255, d[2] / 255);
    };

    const web = new Web(gap);

    const uniforms: Record<string, THREE.IUniform> = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uDpr: { value: dpr },
      uTime: { value: 0 },
      uGap: { value: gap },
      uRadius: { value: radius },
      uPull: { value: pull },
      uSwirl: { value: swirl },
      uHole: { value: 0 },
      uPulse: { value: reduced ? 0 : 1 },
      uGridColor: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
      uAccent: { value: new THREE.Vector3(0.4, 0.8, 1) },
      uSpider: { value: new THREE.Vector3(0, 0, 0) },
      uWeb: { value: web.tex },
      uWebSize: { value: new THREE.Vector2(web.TW, web.TH) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      blending: THREE.NoBlending,
      depthTest: false,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(geometry, material));
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // spider overlay (2D canvas above the WebGL canvas)
    const spiderObj = spider && oc ? new Spider(spiderScale, gap, web) : null;
    const octx = spiderObj && oc ? oc.getContext("2d") : null;

    let h = 1;
    const readColors = () => {
      cssToVec(getComputedStyle(wrap).color, uniforms.uGridColor.value);
      if (primaryRef.current)
        cssToVec(
          getComputedStyle(primaryRef.current).color,
          uniforms.uAccent.value,
        );
    };
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      h = r.height;
      renderer.setSize(r.width, r.height, false);
      uniforms.uRes.value.set(r.width, r.height);

      // grid origin in the shader is the bottom of the *drawing buffer*
      const Hs = Math.floor(r.height * dpr) / dpr;
      if (web.resize(r.width, Hs)) {
        uniforms.uWeb.value = web.tex;
        (uniforms.uWebSize.value as THREE.Vector2).set(web.TW, web.TH);
      }

      if (oc && octx && spiderObj) {
        const ov = Math.min(window.devicePixelRatio || 1, 2);
        oc.width = Math.round(r.width * ov);
        oc.height = Math.round(r.height * ov);
        octx.setTransform(ov, 0, 0, ov, 0, 0);
        spiderObj.resetClear();
        spiderObj.setBounds(r.width, Hs);
      }
      renderer.render(scene, camera);
    };

    gl.current = {
      renderer,
      scene,
      camera,
      uniforms,
      web,
      spider: spiderObj,
      octx,
    };
    readColors();
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    // spring outputs -> shader uniforms
    const unsubs = [
      sx.on("change", (v) => (uniforms.uMouse.value.x = v)),
      sy.on("change", (v) => (uniforms.uMouse.value.y = h - v)), // flip to GL space
      hole.on(
        "change",
        (v) => (uniforms.uHole.value = Math.min(Math.max(v, 0), 1)),
      ),
    ];

    let active = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || reduced) return;
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (!inside) {
        active = false;
        holeTarget.set(0);
        return;
      }
      if (!active) {
        sx.jump(x); // don't streak in from wherever the cursor last was
        sy.jump(y);
        active = true;
      }
      mx.set(x);
      my.set(y);
      holeTarget.set(1);
    };
    const onLeave = () => {
      active = false;
      holeTarget.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      unsubs.forEach((u) => u());
      ro.disconnect();
      mo.disconnect();
      geometry.dispose();
      material.dispose();
      web.tex.dispose();
      renderer.dispose();
      gl.current = null;
    };
  }, [
    gap,
    radius,
    pull,
    swirl,
    spider,
    spiderScale,
    reduced,
    mx,
    my,
    sx,
    sy,
    holeTarget,
    hole,
  ]);

  // Motion's frame loop: renders only while the hero is on screen
  useAnimationFrame((t, delta) => {
    const g = gl.current;
    if (!g || !inView) return;
    g.uniforms.uTime.value = reduced ? 0 : t / 1000;
    const dt = reduced ? 0 : Math.min(delta / 1000, 0.05);
    const hv = g.uniforms.uHole.value as number;

    // the cursor tears the web where it bends it hardest
    if (tear && !reduced) {
      const m = g.uniforms.uMouse.value as THREE.Vector2;
      g.web.tear(m.x, m.y, hv, dt, radius);
    }

    if (g.spider && g.octx) {
      g.spider.update(dt, {
        x: sx.get(),
        y: sy.get(),
        active: hv > 0.05 && !reduced,
      });
      g.spider.draw(g.octx);
      g.uniforms.uSpider.value.set(
        g.spider.glowX,
        g.spider.H - g.spider.glowY, // screen (y down) -> GL (y up)
        g.spider.ready ? g.spider.glow : 0,
      );
    }

    g.web.flush();
    g.renderer.render(g.scene, g.camera);
  });

  return (
    <motion.div
      ref={wrapRef}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={`absolute inset-0 text-foreground pointer-events-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
      />
      {spider && (
        <canvas
          ref={spiderCanvasRef}
          className="absolute inset-0 block h-full w-full"
        />
      )}
      <span ref={primaryRef} className="hidden text-primary" />
    </motion.div>
  );
}
