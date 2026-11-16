/**
 * Hero art: four 8-bit workers building an app, with data packets running in
 * from two network nodes. One inline SVG of pixel rects, animated with CSS
 * steps() keyframes. No JavaScript, no images. Reduced motion shows the
 * finished app as a still picture.
 *
 * Coordinates are in "pixels" of a 160 x 108 grid.
 */

const PALETTE = {
  k: "#2c241c", // ink
  p: "#fff9ef", // paper
  a: "#e5ad4e", // amber
  r: "#9f3f32", // brick
} as const;

type Colour = keyof typeof PALETTE;

/** Turns a sprite (rows of palette letters, "." = empty) into run-length rects. */
function Sprite({ rows, x = 0, y = 0 }: { rows: string[]; x?: number; y?: number }) {
  const rects: { x: number; y: number; w: number; c: Colour }[] = [];
  rows.forEach((row, rowIndex) => {
    let start = 0;
    for (let col = 1; col <= row.length; col++) {
      if (row[col] !== row[start]) {
        const c = row[start];
        if (c !== ".") rects.push({ x: start, y: rowIndex, w: col - start, c: c as Colour });
        start = col;
      }
    }
  });
  return (
    <g transform={`translate(${x} ${y})`}>
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} fill={PALETTE[r.c]} />
      ))}
    </g>
  );
}

function Px({ x, y, w = 1, h = 1, c = "k" }: { x: number; y: number; w?: number; h?: number; c?: Colour }) {
  return <rect x={x} y={y} width={w} height={h} fill={PALETTE[c]} />;
}

/* Worker sprites, 8 x 11. Hard hat, face, overalls. */
const ARMS_DOWN = [
  "..aaaa..",
  ".aaaaaa.",
  "..pppp..",
  "..kppk..",
  "..pppp..",
  ".aaaaaa.",
  "a.akka.a",
  "p.aaaa.p",
  "..kkkk..",
  "..k..k..",
  ".kk..kk.",
];
const ARMS_UP = [
  "..aaaa..",
  "paaaaaap",
  "a.pppp.a",
  "a.kppk.a",
  "..pppp..",
  ".aaaaaa.",
  "..akka..",
  "..aaaa..",
  "..kkkk..",
  "..k..k..",
  ".kk..kk.",
];
const STRIDE = [...ARMS_UP.slice(0, 9), ".k....k.", "kk....kk"];
const TYPING = [...ARMS_DOWN.slice(0, 6), ".aakkaa.", ".paaaap.", ...ARMS_DOWN.slice(8)];

/** Two frames that swap every half cycle. */
function Frames({ a, b, rate }: { a: React.ReactNode; b: React.ReactNode; rate: string }) {
  const style = { "--px-rate": rate } as React.CSSProperties;
  return (
    <>
      <g className="px-a" style={style}>{a}</g>
      <g className="px-b" style={style}>{b}</g>
    </>
  );
}

/* The app being built: each piece appears in turn, then the loop resets. */
const LOOP_SECONDS = 12;
const PIECES: React.ReactNode[] = [
  // nav
  <g key="nav">
    <Px x={52} y={54} w={10} h={2} />
    <Px x={90} y={54} w={6} h={2} />
    <Px x={98} y={54} w={6} h={2} />
    <Px x={106} y={54} w={6} h={2} />
  </g>,
  // image with a pixel mountain
  <g key="img">
    <Px x={52} y={60} w={28} h={20} c="a" />
    <Px x={58} y={74} w={18} h={6} c="k" />
    <Px x={61} y={71} w={12} h={3} c="k" />
    <Px x={64} y={68} w={6} h={3} c="k" />
    <Px x={72} y={63} w={3} h={3} c="p" />
  </g>,
  // headline
  <g key="h1">
    <Px x={84} y={61} w={26} h={3} />
    <Px x={84} y={66} w={19} h={3} />
  </g>,
  // body text
  <g key="text">
    <Px x={84} y={72} w={28} />
    <Px x={84} y={75} w={23} />
  </g>,
  // button
  <g key="btn">
    <Px x={84} y={79} w={15} h={5} c="r" />
    <Px x={87} y={81} w={9} c="p" />
  </g>,
  ...[52, 74, 96].map((x) => (
    <g key={`card${x}`}>
      <Px x={x} y={87} w={18} h={11} />
      <Px x={x + 1} y={88} w={16} h={4} c="a" />
      <Px x={x + 1} y={92} w={16} h={5} c="p" />
      <Px x={x + 3} y={94} w={10} />
    </g>
  )),
];

/* Network: dotted links from two nodes to the window, with packets travelling in. */
const LINKS = [
  { from: [18, 20], to: [46, 47], delay: 0 },
  { from: [142, 22], to: [118, 47], delay: 1.1 },
];

function dots(from: number[], to: number[]) {
  const steps = Math.round(Math.hypot(to[0] - from[0], to[1] - from[1]) / 3);
  return Array.from({ length: steps }, (_, i) => {
    const t = i / steps;
    return [Math.round(from[0] + (to[0] - from[0]) * t), Math.round(from[1] + (to[1] - from[1]) * t)];
  });
}

/** Frame swaps, walking and floating code. Lives here so the scene is self-contained. */
const BASE_CSS = `
.px-scene .px-a{animation:px-a var(--px-rate,.5s) steps(1) infinite}
.px-scene .px-b{opacity:0;animation:px-b var(--px-rate,.5s) steps(1) infinite}
@keyframes px-a{50%{opacity:0}}
@keyframes px-b{50%{opacity:1}}
.px-scene .px-walk{animation:px-walk 3.6s steps(18) infinite alternate}
@keyframes px-walk{to{transform:translateX(18px)}}
.px-scene .px-code{animation:px-code 1.6s steps(6) infinite}
@keyframes px-code{from{transform:translateY(0);opacity:1}to{transform:translateY(-12px);opacity:0}}
@media (prefers-reduced-motion:reduce){
  .px-scene *{animation:none!important}
  .px-scene .px-packet,.px-scene .px-code{display:none}
}`;

function keyframes() {
  const pieces = PIECES.map((_, index) => {
    const on = ((0.6 + index * 1.05) / LOOP_SECONDS) * 100;
    return `@keyframes px-piece-${index}{0%,${(on - 0.01).toFixed(2)}%{opacity:0}${on.toFixed(2)}%,92%{opacity:1}92.01%,100%{opacity:0}}`;
  });
  const packets = LINKS.map(
    ({ from, to }, index) =>
      `@keyframes px-packet-${index}{from{transform:translate(${from[0]}px,${from[1]}px)}to{transform:translate(${to[0] - 1}px,${to[1] - 1}px)}}`,
  );
  return [BASE_CSS, ...pieces, ...packets].join("");
}

export function PixelBuild({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 108"
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="crispEdges"
      className={`px-scene overflow-visible ${className ?? ""}`}
      aria-hidden="true"
    >
      <style>{keyframes()}</style>

      {/* Ground, wide enough to run edge to edge of the panel. */}
      <Px x={-400} y={104} w={960} h={1} c="k" />

      {/* Network nodes */}
      <g>
        <Px x={8} y={8} w={10} h={16} />
        <Px x={10} y={11} w={6} h={1} c="a" />
        <Px x={10} y={15} w={6} h={1} c="a" />
        <Px x={10} y={19} w={2} h={1} c="p" />
        <Px x={13} y={19} w={1} h={1} c="a" />
      </g>
      <Sprite
        x={136}
        y={14}
        rows={["...ppp.....", "..ppppp.pp.", ".pppppppppp", "ppppppppppp", ".kkkkkkkkk."]}
      />
      {LINKS.map(({ from, to }, index) => (
        <g key={index} opacity={0.75}>
          {dots(from, to).map(([x, y]) => (
            <Px key={`${x}-${y}`} x={x} y={y} c="p" />
          ))}
        </g>
      ))}
      {LINKS.map(({ delay }, index) => (
        <rect
          key={`packet-${index}`}
          className="px-packet"
          width={2}
          height={2}
          fill={PALETTE.a}
          style={{ animation: `px-packet-${index} 2.2s steps(9) ${delay}s infinite` }}
        />
      ))}

      {/* App window frame */}
      <Px x={46} y={44} w={72} h={60} />
      <Px x={48} y={50} w={68} h={52} c="p" />
      <Px x={49} y={46} w={2} h={2} c="r" />
      <Px x={52} y={46} w={2} h={2} c="a" />
      <Px x={55} y={46} w={2} h={2} c="p" />
      {PIECES.map((piece, index) => (
        <g
          key={index}
          className="px-piece"
          style={{ animation: `px-piece-${index} ${LOOP_SECONDS}s steps(1) infinite` }}
        >
          {piece}
        </g>
      ))}

      {/* 1. Hammering on the roof */}
      <g transform="translate(70 33)">
        <Frames
          rate="0.5s"
          a={
            <>
              <Sprite rows={ARMS_DOWN} />
              <Px x={8} y={7} w={3} />
              <Px x={11} y={5} w={2} h={4} />
              <Px x={14} y={9} c="p" />
              <Px x={13} y={6} c="a" />
            </>
          }
          b={
            <>
              <Sprite rows={ARMS_UP} />
              <Px x={7} y={-3} w={1} h={3} />
              <Px x={6} y={-5} w={4} h={2} />
            </>
          }
        />
      </g>

      {/* 2. Carrying blocks from the pile */}
      <Sprite
        x={1}
        y={92}
        rows={["..kkkkkk....", "..kaaaak....", "..kaaaak....", "kkkkkkkkkkkk", "kaaaakkaaaak", "kaaaakkaaaak", "kaaaakkaaaak", "kaaaakkaaaak", "kaaaakkaaaak", "kaaaakkaaaak", "kaaaakkaaaak", "kkkkkkkkkkkk"]}
      />
      <g transform="translate(15 89)">
        <g className="px-walk">
          <Px x={1} y={0} w={6} h={4} c="k" />
          <Px x={2} y={1} w={4} h={2} c="a" />
          <g transform="translate(0 4)">
            <Frames rate="0.36s" a={<Sprite rows={ARMS_UP} />} b={<Sprite rows={STRIDE} />} />
          </g>
        </g>
      </g>

      {/* 3. Painting the frame from a ladder */}
      <g>
        <Px x={121} y={66} w={1} h={38} />
        <Px x={128} y={66} w={1} h={38} />
        {[70, 76, 82, 88, 94, 100].map((y) => (
          <Px key={y} x={121} y={y} w={8} />
        ))}
      </g>
      <g transform="translate(121 71)">
        <Frames
          rate="0.8s"
          a={
            <>
              <Sprite rows={ARMS_DOWN} />
              <Px x={-1} y={7} w={1} h={2} />
              <Px x={-3} y={5} w={2} h={4} c="p" />
            </>
          }
          b={
            <>
              <Sprite rows={ARMS_UP} />
              <Px x={-1} y={-1} w={1} h={2} />
              <Px x={-3} y={-4} w={2} h={4} c="p" />
            </>
          }
        />
      </g>

      {/* 4. Coding at a desk */}
      <g>
        <Px x={132} y={96} w={26} h={1} />
        <Px x={133} y={97} w={1} h={7} />
        <Px x={156} y={97} w={1} h={7} />
        <Px x={144} y={86} w={12} h={9} />
        <Px x={145} y={87} w={10} h={7} c="r" />
        <Px x={146} y={88} w={5} c="a" />
        <Px x={146} y={90} w={7} c="p" />
        <Px x={146} y={92} w={4} c="a" />
        <Px x={149} y={95} w={2} h={1} />
      </g>
      <g transform="translate(134 93)">
        <Frames rate="0.24s" a={<Sprite rows={ARMS_DOWN} />} b={<Sprite rows={TYPING} />} />
      </g>
      <g className="px-code">
        <Sprite x={147} y={78} rows={[".p.p.", "p...p", ".p.p."]} />
      </g>
    </svg>
  );
}
