"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { content } from "@/lib/content";
import Reveal from "./Reveal";
import Parallax from "./Parallax";
import { useRevealCircle } from "./useRevealCircle";

/**
 * Big centered pull-quote over a parallaxing background picture. On hover the
 * shared reveal circle (see useRevealCircle) grows from the cursor and shows a
 * witty alternate quote in cream through the green circle — the same spotlight
 * mechanism as the hero/about sections. The reveal layer replicates the base
 * quote's box so the two align pixel-for-pixel at every breakpoint.
 */
export default function Philosophy() {
  const { philosophy } = content;
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useRevealCircle(contentRef, revealRef);

  const quoteType =
    "display text-balance text-4xl font-semibold sm:text-6xl lg:text-7xl";

  return (
    <section className="full-bleed relative flex min-h-screen items-center overflow-hidden py-20">
      {/* Full-bleed picture banner. Uses an online placeholder photo (swap the url
          below for your own image any time — it's a plain CSS background, so no
          next.config domain setup is needed). The section is full-bleed (100vw, via
          .full-bleed), so this frame fills it edge-to-edge — full viewport width and
          section height, like the reference's motto image. overflow-hidden clips the
          oversized image; the frame is fixed, so it scrolls at page speed. */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* The image is oversized (250% of the frame, centred via -top-[75%]) and
            Parallax slides it vertically within the frame. The frame edges are fixed
            (they scroll at page speed with the text), while the image drifts much
            slower — so the TEXT visibly scrolls faster than the background (~0.5x
            page speed). Negative amount = the bg lags the page, not races ahead. The
            75% overflow top & bottom keeps the frame covered through the whole slide.
            amount is the tuning knob (more negative = slower bg / stronger effect). */}
        <Parallax amount={-34} className="absolute inset-x-0 -top-[75%] h-[250%]">
          <div
            aria-hidden="true"
            className="h-full w-full bg-cover bg-center opacity-60"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80')",
            }}
          />
        </Parallax>
      </div>

      {/* Cream scrim: a soft radial wash of the page colour behind the quote so the
          dark text stays legible over the picture, while the band's edges keep the
          image (and its parallax drift) clearly visible. Sits above the picture,
          below the quote. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[5]"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 50%, var(--color-background) 0%, color-mix(in oklab, var(--color-background) 40%, transparent) 55%, transparent 80%)",
        }}
      />

      {/* Base quote — centred vertically by the section's flex, horizontally by mx-auto */}
      <div ref={contentRef} className="mx-auto max-w-2xl px-5 text-center sm:px-8">
        <Reveal>
          <blockquote className={`${quoteType} text-[var(--color-foreground)]`}>
            “{philosophy.quote}”
          </blockquote>
          <p className="mt-6 text-[var(--color-muted)]">— {philosophy.author}</p>
        </Reveal>
      </div>

      {/* Reveal layer — the witty quote, shown only inside the cursor circle (see
          .hero-reveal). Replicates the base box (same py + inner wrapper + type) so
          it sits exactly over the base quote at every breakpoint. */}
      {!reduce && (
        <div
          ref={revealRef}
          aria-hidden="true"
          inert
          className="hero-reveal pointer-events-none absolute inset-0 z-[1] flex items-center py-20 [&_*]:!text-[var(--color-background)]"
        >
          <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
            <blockquote className={quoteType}>“{philosophy.wittyQuote}”</blockquote>
            <p className="mt-6">— {philosophy.wittyAuthor}</p>
          </div>
        </div>
      )}
    </section>
  );
}
