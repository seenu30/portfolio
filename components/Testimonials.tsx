"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { content } from "@/lib/content";
import SectionHeading from "./SectionHeading";

export default function Testimonials() {
  const { testimonials } = content;
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  const n = testimonials.items.length;
  const go = (d: number) => setIndex((p) => (p + d + n) % n);
  const t = testimonials.items[index];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <SectionHeading kicker={testimonials.kicker} title={testimonials.title} />

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          data-cursor="drag"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="mt-14 min-h-[13rem] rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] sm:min-h-[11rem]"
        >
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 1] }}
            >
              <p className="max-w-3xl text-2xl font-medium leading-snug tracking-tight text-[var(--color-foreground)] sm:text-3xl">
                “{t.quote}”
              </p>
              <footer className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-accent-2)] text-sm font-semibold text-[var(--color-on-accent-2)]"
                >
                  {t.name.charAt(0)}
                </span>
                <span className="text-sm">
                  <span className="font-semibold text-[var(--color-foreground)]">
                    {t.name}
                  </span>
                  <span className="block text-[var(--color-muted)]">{t.role}</span>
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            data-cursor
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-border-strong)] transition-colors hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            data-cursor
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-border-strong)] transition-colors hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            →
          </button>

          <div className="ml-2 flex gap-2" aria-hidden="true">
            {testimonials.items.map((item, i) => (
              <span
                key={item.name}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-[var(--color-foreground)]"
                    : "w-1.5 bg-[var(--color-border-strong)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
