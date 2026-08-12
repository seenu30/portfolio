import { Fragment, type CSSProperties } from "react";
import type { HeadlineSegment } from "@/lib/content";

type Props = {
  segments: HeadlineSegment[];
  className?: string;
  /** seconds before the first letter animates */
  baseDelay?: number;
  /** seconds between successive letters */
  step?: number;
  /** render letters at final position with no entrance animation (for the reveal duplicate) */
  noAnimation?: boolean;
  /** element to render as; use "div" for the aria-hidden reveal copy */
  as?: "h1" | "div";
};

/**
 * Two-tone headline with a per-letter rise-in reveal.
 *
 * Server component (no client JS): each letter is a <span> with a CSS
 * animation-delay. The whole phrase lives in the <h1> aria-label so screen
 * readers announce it once; the visual letters are aria-hidden. Splitting uses
 * Array.from (grapheme-safe) on plain strings — never innerHTML, so no XSS sink.
 * Resting opacity is 1, so if JS/CSS animation never runs the text is still shown.
 */
export default function AnimatedText({
  segments,
  className,
  baseDelay = 0.05,
  step = 0.028,
  noAnimation = false,
  as = "h1",
}: Props) {
  const label = segments.map((s) => s.text).join(" ");
  let letterIndex = 0;
  const Tag = as;

  return (
    <Tag aria-label={as === "h1" ? label : undefined} className={className}>
      <span aria-hidden="true">
        {segments.map((segment, si) => {
          const words = segment.text.split(" ");
          // Two-tone is colour only — base tan, emphasized words in the accent.
          const toneClass = segment.emphasis
            ? "text-[var(--color-accent-2)]"
            : "text-[var(--color-foreground)]";

          return (
            <span key={si} className={toneClass}>
              {words.map((word, wi) => (
                <Fragment key={wi}>
                  {/* keep each word unbreakable so letter-splitting never wraps mid-word */}
                  <span className="inline-block whitespace-nowrap">
                    {Array.from(word).map((char, ci) => {
                      const delay = baseDelay + letterIndex * step;
                      letterIndex += 1;
                      return (
                        <span
                          key={ci}
                          className={noAnimation ? "inline-block" : "hero-letter"}
                          style={
                            noAnimation
                              ? undefined
                              : ({ "--delay": `${delay}s` } as CSSProperties)
                          }
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                  {/* space after each word except the segment's last (outside the
                      inline-block so it doesn't collapse) */}
                  {wi < words.length - 1 ? " " : ""}
                </Fragment>
              ))}
              {/* space between segments */}
              {si < segments.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
