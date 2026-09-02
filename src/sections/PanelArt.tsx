type Props = { hue: 'red' | 'blue'; seed: number };

// Lienzo de proporción fija que se recorta al panel: las formas nunca se deforman.
const W = 160;
const H = 100;
const LAYOUTS = [
  { cx: 108, cy: 46, r: 30, sx: 26, sy: 24, ss: 34, lx: 18, ly: 78, lw: 52 },
  { cx: 52, cy: 40, r: 26, sx: 92, sy: 30, ss: 28, lx: 88, ly: 74, lw: 48 },
  { cx: 122, cy: 58, r: 24, sx: 30, sy: 44, ss: 30, lx: 22, ly: 26, lw: 44 },
];

/** Arte de viñeta: trama de puntos y formas planas en una tinta. Nada de capturas borrosas. */
export default function PanelArt({ hue, seed }: Props) {
  const color = hue === 'red' ? 'var(--red)' : 'var(--blue)';
  const l = LAYOUTS[seed % LAYOUTS.length];
  return (
    <svg className="panel__art" aria-hidden="true" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`dots-${seed}`} width="3" height="3" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.5" fill="var(--dots)" />
        </pattern>
      </defs>
      <rect x="-40" y="-40" width={W + 80} height={H + 80} fill={`url(#dots-${seed})`} />
      <g className="panel__shapes">
        <circle cx={l.cx} cy={l.cy} r={l.r} fill={color} />
        <rect x={l.sx} y={l.sy} width={l.ss} height={l.ss} fill="none" stroke="var(--ink)" strokeWidth="1.6" />
        <line x1={l.lx} y1={l.ly} x2={l.lx + l.lw} y2={l.ly} stroke="var(--ink)" strokeWidth="1.6" />
        <line x1={l.cx + l.r + 6} y1={l.cy - l.r} x2={l.cx + l.r + 24} y2={l.cy - l.r + 18} stroke={color} strokeWidth="1.6" />
      </g>
    </svg>
  );
}
