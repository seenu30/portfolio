"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { content } from "@/lib/content";
import Reveal from "./Reveal";
import { useRevealCircle } from "./useRevealCircle";

type AboutCopy = typeof content.about;
type Word = { text: string; emphasis: boolean };

/** Flatten the statement segments into words, carrying each word's emphasis. */
function toWords(about: AboutCopy): Word[] {
  return about.statement.flatMap((seg) =>
    seg.text.split(" ").map((w) => ({ text: w, emphasis: Boolean(seg.emphasis) })),
  );
}

/** One word whose opacity is scrubbed dim → full over its slice of scroll. */
function ScrollWord({
  progress,
  start,
  end,
  className,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  className: string;
  children: string;
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <motion.span style={{ opacity, willChange: "opacity" }} className={className}>
      {children}
    </motion.span>
  );
}

/**
 * The oversized statement. With `progress`, each word brightens from 0.2 → 1 as
 * the block scrolls up (reference minhpham.design: a dim base revealed word by
 * word, left→right, scrubbed to scroll). Without it (reveal duplicate / reduced
 * motion), words render static at full opacity.
 */
function Statement({
  words,
  progress,
}: {
  words: Word[];
  progress: MotionValue<number> | null;
}) {
  return (
    <p className="mt-6 text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
      {words.map((w, i) => {
        const cls = w.emphasis
          ? "text-[var(--color-accent-2)]"
          : "text-[var(--color-foreground)]";
        const text = `${w.text}${i < words.length - 1 ? " " : ""}`;
        return progress ? (
          <ScrollWord
            key={i}
            progress={progress}
            start={i / words.length}
            end={(i + 1) / words.length}
            className={cls}
          >
            {text}
          </ScrollWord>
        ) : (
          <span key={i} className={cls}>
            {text}
          </span>
        );
      })}
    </p>
  );
}

/** Small uppercase kicker beside the statement. */
function Kicker({ text }: { text: string }) {
  return (
    <p className="text-sm font-bold uppercase tracking-[0.5em] text-[var(--color-foreground)]">
      {text}
    </p>
  );
}

/**
 * "About me" block — a small kicker beside one oversized statement. The statement
 * brightens word by word as it scrolls into view (scroll-scrubbed), and still
 * carries the shared pointer-following reveal circle (see useRevealCircle): a
 * recoloured duplicate shown through a growing circular mask over the content.
 */
export default function About() {
  const { about } = content;
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const words = toWords(about);
  const reduce = useReducedMotion();

  useRevealCircle(contentRef, revealRef);

  // Scrub word brightness as the block travels from ~0.7vh down to ~0.25vh from
  // the top — starts a touch later than the reference so it reads deliberately.
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start 0.7", "start 0.25"],
  });
  const baseProgress = reduce ? null : scrollYProgress;

  return (
    <section id="about" className="relative py-24 sm:py-32">
      {/* Base content — statement brightens word by word on scroll */}
      <div ref={contentRef} className="px-5 sm:px-8">
        <Reveal>
          <Kicker text={about.kicker} />
          <Statement words={words} progress={baseProgress} />
        </Reveal>
      </div>

      {/* Recoloured reveal, shown only inside the cursor mask (see .hero-reveal).
          Spans the full viewport width (left/right -50vw + matching padding) so the
          reveal circle is never clipped at the page-frame gutter on the left/right;
          the 50vw padding puts the inner content back over the base copy. */}
      <div
        ref={revealRef}
        aria-hidden="true"
        inert
        className="hero-reveal pointer-events-none absolute inset-y-0 z-[1] py-24 sm:py-32 [&_*]:!text-[var(--color-background)]"
        style={{
          left: "-50vw",
          right: "-50vw",
          paddingLeft: "50vw",
          paddingRight: "50vw",
        }}
      >
        <div className="px-5 sm:px-8">
          <Kicker text={about.kicker} />
          <Statement words={words} progress={null} />
        </div>
      </div>
    </section>
  );
}
