"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "motion/react";

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// uColors layout (all 5 required):
// [0] deepNavy   - base/background tone
// [1] indigo     - first blend stop
// [2] blueViolet - second blend stop
// [3] lavender   - highlight/peak tone
// [4] violetPop  - streak accent color
const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uSpeed;
  uniform vec3 uColors[5];

  // Ashima simplex noise (3D)
  vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p){
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++){
      value += amp * snoise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return value;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    float t = uTime * 0.06 * uSpeed;

    // domain warp for smooth "wave" flow
    vec3 warpCoordA = vec3(p * 1.4, t);
    vec2 warp = vec2(
      fbm(warpCoordA + vec3(0.0, 0.0, 0.0)),
      fbm(warpCoordA + vec3(5.2, 1.3, 0.0))
    );

    vec3 warpCoordB = vec3(p * 1.6 + warp * 0.6, t * 1.3);
    float n = fbm(warpCoordB);

    vec3 warpCoordC = vec3(p * 0.8 - warp * 0.4, t * 0.7 + 10.0);
    float n2 = fbm(warpCoordC);

    float mixVal = n * 0.6 + n2 * 0.4;
    mixVal = mixVal * 0.5 + 0.5;

    vec3 deepNavy   = uColors[0];
    vec3 indigo     = uColors[1];
    vec3 blueViolet = uColors[2];
    vec3 lavender   = uColors[3];
    vec3 violetPop  = uColors[4];

    vec3 color = deepNavy;
    color = mix(color, indigo, smoothstep(0.15, 0.42, mixVal));
    color = mix(color, blueViolet, smoothstep(0.38, 0.62, mixVal));
    color = mix(color, lavender, smoothstep(0.60, 0.80, mixVal));

    float streak = fbm(vec3(p * vec2(1.0, 1.8) + vec2(t * 0.4, -t * 0.2), t * 0.5 + 30.0));
    streak = smoothstep(0.55, 0.85, streak);
    color = mix(color, violetPop, streak * 0.35);

    float vign = smoothstep(1.1, 0.2, length(p));
    color *= mix(0.75, 1.05, vign);

    gl_FragColor = vec4(color, 1.0);
  }
`;

/** Hex string ("#rrggbb" or "rrggbb") -> [r, g, b] in 0-1 range. */
function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return [r, g, b];
}

/** Default palette — matches the original hardcoded look. */
const DEFAULT_COLORS: [string, string, string, string, string] = [
  "#050517", // deepNavy
  "#120f52", // indigo
  "#2b29d9", // blueViolet
  "#9e94f7", // lavender
  "#7030d9", // violetPop
];

type GradientWaveProps = {
  /** Overall animation speed multiplier. 1 = default. */
  speed?: number;
  /**
   * Five hex colors controlling the gradient, in order:
   * [base, first blend stop, second blend stop, highlight, streak accent].
   * Falls back to the original navy/indigo/violet palette if omitted or
   * if fewer than 5 are provided.
   */
  colors?: string[];
  /** Extra Tailwind classes for the outer rounded container. */
  className?: string;
};

export function GradientWave({
  speed = 1,
  colors,
  className = "",
}: GradientWaveProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const uniformsRef = useRef<{
    uTime: { value: number };
    uResolution: { value: THREE.Vector2 };
    uSpeed: { value: number };
    uColors: { value: THREE.Vector3[] };
  } | null>(null);

  const resolvedColors =
    colors && colors.length >= 5 ? colors.slice(0, 5) : DEFAULT_COLORS;

  // Update color uniforms in place when the `colors` prop changes,
  // without tearing down the WebGL context.
  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;
    resolvedColors.forEach((hex, i) => {
      const [r, g, b] = hexToRgb01(hex);
      uniforms.uColors.value[i].set(r, g, b);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(resolvedColors)]);

  // Keep speed uniform live too, without a full remount.
  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;
    uniforms.uSpeed.value = speed;
  }, [speed]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uSpeed: { value: speed },
      uColors: {
        value: resolvedColors.map((hex) => {
          const [r, g, b] = hexToRgb01(hex);
          return new THREE.Vector3(r, g, b);
        }),
      },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resizeObserver = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    });
    resizeObserver.observe(mount);

    // reduced-motion: render one still frame and stop
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf: number;
    const start = performance.now();
    function animate() {
      const elapsed = (performance.now() - start) / 1000;
      uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(animate);
      }
    }
    animate();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      uniformsRef.current = null;
    };
    // Mount effect only runs once; color/speed updates are handled by the
    // effects above so we don't tear down and rebuild the WebGL context
    // on every prop change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={`overflow-hidden rounded-3xl ${className}`}
    >
      <div ref={mountRef} className="w-full h-full" />
    </motion.div>
  );
}
