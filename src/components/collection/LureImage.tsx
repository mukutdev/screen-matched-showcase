import { COLOURS, type ColourId } from "@/data/collection";

export function LureImage({ colour, size, water = false }: { colour: ColourId; size: number; water?: boolean }) {
  const c = COLOURS.find((x) => x.id === colour)!;
  const len = 140 + ((size - 105) / (250 - 105)) * 220;
  const h = len * 0.17;
  const x0 = 200 - len / 2;
  const y = 150;
  const id = `${colour}-${size}-${water ? "w" : "d"}`;
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label={`${c.name} ${size}mm stickbait`}>
      <rect width="400" height="300" fill={water ? "var(--water)" : "var(--lure-bg)"} />
      {water && (
        <g opacity="0.25" stroke="#ffffff" strokeWidth="2" fill="none">
          <path d="M0 60 Q100 45 200 60 T400 60" />
          <path d="M0 250 Q100 235 200 250 T400 250" />
        </g>
      )}
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.base} />
          <stop offset="0.6" stopColor={c.base} />
          <stop offset="1" stopColor={c.accent} />
        </linearGradient>
      </defs>
      <path
        d={`M${x0} ${y} C ${x0 + len * 0.1} ${y - h}, ${x0 + len * 0.55} ${y - h * 0.75}, ${x0 + len} ${y - h * 0.2} L ${x0 + len} ${y + h * 0.2} C ${x0 + len * 0.55} ${y + h * 0.8}, ${x0 + len * 0.1} ${y + h}, ${x0} ${y} Z`}
        fill={`url(#g-${id})`}
        stroke="rgba(0,0,0,0.25)"
      />
      <circle cx={x0 + len * 0.1} cy={y - h * 0.15} r={h * 0.16} fill="#fff" />
      <circle cx={x0 + len * 0.1} cy={y - h * 0.15} r={h * 0.08} fill="#111" />
      <g stroke={water ? "#ddd" : "#555"} strokeWidth="1.5" fill="none">
        <line x1={x0 + len * 0.3} y1={y + h * 0.55} x2={x0 + len * 0.3} y2={y + h * 1.1} />
        <path d={`M${x0 + len * 0.3 - 6} ${y + h * 1.3} a6 6 0 1 0 12 0`} />
        <line x1={x0 + len * 0.75} y1={y + h * 0.4} x2={x0 + len * 0.75} y2={y + h * 1} />
        <path d={`M${x0 + len * 0.75 - 6} ${y + h * 1.2} a6 6 0 1 0 12 0`} />
      </g>
    </svg>
  );
}

export function Swatch({ colour, soldOut, size = 20 }: { colour: ColourId; soldOut?: boolean; size?: number }) {
  const c = COLOURS.find((x) => x.id === colour)!;
  return (
    <span
      className="relative inline-block shrink-0 rounded-full border border-foreground/20"
      style={{ width: size, height: size, background: c.swatch, opacity: soldOut ? 0.4 : 1 }}
      aria-hidden
    >
      {soldOut && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="block h-px w-[130%] rotate-45 bg-foreground" />
        </span>
      )}
    </span>
  );
}
