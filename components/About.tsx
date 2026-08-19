"use client";

import { useRef } from "react";
import { content } from "@/lib/content";
import Reveal from "./Reveal";
import { useRevealCircle } from "./useRevealCircle";

type AboutCopy = typeof content.about;

/** The kicker + oversized statement, rendered for both the base and the reveal copy. */
function AboutBody({ about }: { about: AboutCopy }) {
  return (
    <>
      <p className="text-sm font-bold uppercase tracking-[0.5em] text-[var(--color-foreground)]">
        {about.kicker}
      </p>
      <p className="mt-6 text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
        {about.statement.map((seg, i) => (
          <span
            key={i}
            className={
              seg.emphasis
                ? "text-[var(--color-accent-2)]"
                : "text-[var(--color-foreground)]"
            }
          >
            {seg.text}
            {i < about.statement.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </>
  );
}

/**
 * "About me" block — a small kicker beside one oversized statement. Carries the
 * same pointer-following reveal circle as the hero (see useRevealCircle): a
 * recoloured duplicate shown through a growing circular mask over the content.
 */
export default function About() {
  const { about } = content;
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useRevealCircle(contentRef, revealRef);

  return (
    <section id="about" className="relative py-24 sm:py-32">
      {/* Base content */}
      <div ref={contentRef} className="mx-auto max-w-2xl px-5 sm:px-8">
        <Reveal>
          <AboutBody about={about} />
        </Reveal>
      </div>

      {/* Recoloured reveal, shown only inside the cursor mask (see .hero-reveal) */}
      <div
        ref={revealRef}
        aria-hidden="true"
        inert
        className="hero-reveal pointer-events-none absolute inset-0 z-[1] py-24 sm:py-32 [&_*]:!text-[var(--color-background)]"
      >
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <AboutBody about={about} />
        </div>
      </div>
    </section>
  );
}
