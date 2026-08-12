import type { CSSProperties } from "react";

export type MarqueeItem = { label: string; path?: string; hex?: string };

type Props = {
  items: readonly MarqueeItem[];
  /** seconds per full loop */
  duration?: number;
};

/**
 * Infinite horizontal marquee — pure CSS (see .marquee in globals.css).
 * The track is duplicated so the -50% translate loops seamlessly; it pauses on
 * hover and freezes under prefers-reduced-motion. Server component, zero JS.
 */
/**
 * Brand hexes that are near-black (e.g. Notion, Vercel = #000000) disappear on
 * the dark background — fall back to `currentColor` (the muted tan) for those so
 * the logo stays visible. Threshold on perceived luminance.
 */
function tooDarkForBg(hex?: string): boolean {
  if (!hex || hex.length < 6) return false;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 40;
}

export default function Marquee({ items, duration = 32 }: Props) {
  const Row = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <div
      className="flex shrink-0 items-center gap-3 pr-3"
      aria-hidden={ariaHidden}
    >
      {items.map((item, i) => (
        <span
          key={i}
          data-cursor
          className="group flex items-center gap-2.5 pr-3 text-sm font-medium text-[var(--color-subtle)]"
        >
          {item.path ? (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 shrink-0 fill-current transition-transform duration-200 group-hover:scale-125"
              style={
                item.hex && !tooDarkForBg(item.hex)
                  ? { color: `#${item.hex}` }
                  : undefined
              }
            >
              <path d={item.path} />
            </svg>
          ) : null}
          {item.label}
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee">
      <div
        className="marquee__track"
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        <Row />
        {/* duplicate for seamless loop */}
        <Row ariaHidden />
      </div>
    </div>
  );
}
