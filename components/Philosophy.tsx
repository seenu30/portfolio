"use client";

import { content } from "@/lib/content";
import Reveal from "./Reveal";
import Parallax from "./Parallax";

/** Big centered pull-quote — the copy flips in honest mode. */
export default function Philosophy() {
  const { philosophy } = content;

  return (
    <section data-cursor="expand" className="relative overflow-hidden py-28 sm:py-40">
      <Parallax
        amount={20}
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center"
      >
        <div className="orb h-[26rem] w-[26rem] opacity-50" />
      </Parallax>

      <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
        <Reveal>
          <blockquote
            data-cursor="expand"
            className="display mx-auto max-w-4xl text-balance text-4xl font-semibold sm:text-6xl lg:text-7xl"
          >
            “{philosophy.quote}”
          </blockquote>
          <p className="mt-6 text-[var(--color-muted)]">— {philosophy.author}</p>
        </Reveal>
      </div>
    </section>
  );
}
