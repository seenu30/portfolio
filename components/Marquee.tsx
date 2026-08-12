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
              style={item.hex ? { color: `#${item.hex}` } : undefined}
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
