"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { content } from "@/lib/content";
import { useRevealCircle } from "./useRevealCircle";

type Testimonial = (typeof content.testimonials.items)[number];

/** Split "Head of Product, Orbit Labs" → ["Head of Product", "Orbit Labs"]. */
function splitRole(role: string): [string, string] {
  const at = role.indexOf(", ");
  return at >= 0 ? [role.slice(0, at), role.slice(at + 2)] : [role, ""];
}

/** Small round avatar with the person's initial (placeholder for a headshot). */
function Avatar({
  name,
  active,
  className = "",
}: {
  name: string;
  active: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center rounded-full bg-[var(--color-accent-2)] font-semibold text-[var(--color-on-accent-2)] transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-30"
      } ${className}`}
    >
      {name.charAt(0)}
    </span>
  );
}

/** One quote word, brightened dim → full over its (overlapping) slice of scroll. */
function ScrollWord({
  progress,
  start,
  end,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: string;
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  return (
    <motion.span style={{ opacity, willChange: "opacity" }}>{children}</motion.span>
  );
}

// Shared per-testimonial box metrics so the base and the reveal copy stack identically.
// Natural height (no min-h) so the hover region hugs the text, not empty space.
const ITEM_BOX = "py-16 sm:py-20";
const QUOTE_TYPE =
  "display mt-6 text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl";

/**
 * One stacked testimonial (base copy): an oversized quote that brightens word by
 * word as it scrolls up, with name / role / company beneath. Reports itself active
 * (IntersectionObserver centred band) so the sticky avatar rail can track it.
 */
function QuoteBase({
  t,
  index,
  onActive,
  reduce,
}: {
  t: Testimonial;
  index: number;
  onActive: (i: number) => void;
  reduce: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "start 0.3"],
  });
  const words = t.quote.split(" ");
  const [roleTitle, company] = splitRole(t.role);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) onActive(index);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index, onActive]);

  return (
    <article
      ref={ref}
      className={`${ITEM_BOX} ${index > 0 ? "border-t border-[var(--color-border)]" : ""}`}
    >
      {/* Mobile-only inline avatar (the desktop rail is sticky on the right) */}
      <Avatar name={t.name} active className="mb-6 h-14 w-14 text-lg sm:hidden" />

      <span
        aria-hidden="true"
        data-reveal-text
        className="block font-serif text-7xl leading-[0.6] text-[var(--color-accent-2)]"
      >
        “
      </span>

      <blockquote
        data-reveal-text
        className={`${QUOTE_TYPE} text-[var(--color-foreground)]`}
      >
        {words.map((w, i) =>
          reduce ? (
            <span key={i}>{w}{i < words.length - 1 ? " " : ""}</span>
          ) : (
            <ScrollWord
              key={i}
              progress={scrollYProgress}
              start={i / words.length}
              end={(i + 1) / words.length}
            >
              {`${w}${i < words.length - 1 ? " " : ""}`}
            </ScrollWord>
          ),
        )}
      </blockquote>

      <footer data-reveal-text className="mt-8 text-sm">
        <p className="font-semibold text-[var(--color-foreground)]">{t.name}</p>
        <p className="text-[var(--color-muted)]">{roleTitle}</p>
        {company ? <p className="text-[var(--color-muted)]">{company}</p> : null}
      </footer>
    </article>
  );
}

/** Static recoloured copy of a testimonial for the shared reveal layer. */
function QuoteReveal({ t, index }: { t: Testimonial; index: number }) {
  const [roleTitle, company] = splitRole(t.role);
  return (
    <div
      className={`${ITEM_BOX} ${index > 0 ? "border-t border-transparent" : ""}`}
    >
      {/* Match the base's mobile-avatar spacer height so the copies align on mobile */}
      <span className="block mb-6 h-14 w-14 sm:hidden" />
      <span className="block font-serif text-7xl leading-[0.6]">“</span>
      <blockquote className={QUOTE_TYPE}>{t.quote}</blockquote>
      <footer className="mt-8 text-sm">
        <p className="font-semibold">{t.name}</p>
        <p>{roleTitle}</p>
        {company ? <p>{company}</p> : null}
      </footer>
    </div>
  );
}

/**
 * Testimonials as a scrollytelling stack (reference minhpham.design): quotes
 * scroll past one by one (each brightening word by word) while a sticky avatar
 * rail lights the person in view. Hovering the column reveals a recoloured copy
 * through the shared pointer-following circle (one layer over the whole column so
 * the circle isn't clipped between quotes).
 */
export default function Testimonials() {
  const { testimonials } = content;
  const items = testimonials.items;
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const onActive = useCallback((i: number) => setActive(i), []);

  const columnRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  // Only reveal while the pointer is over the quote text, not the empty column.
  useRevealCircle(columnRef, revealRef, { activeSelector: "[data-reveal-text]" });

  return (
    <section className="relative py-24 sm:py-32">
      <div className="px-5 sm:px-8">
        {/* Header + divider */}
        <p className="text-sm font-bold uppercase tracking-[0.5em] text-[var(--color-foreground)]">
          {testimonials.kicker}
        </p>
        <div className="full-bleed mt-8 border-t border-[var(--color-border)]" />

        <div className="grid sm:grid-cols-[1fr_auto] sm:gap-16">
          {/* Stacked quotes (hover target for the reveal circle) */}
          <div ref={columnRef} className="relative">
            {items.map((t, i) => (
              <QuoteBase
                key={t.name}
                t={t}
                index={i}
                onActive={onActive}
                reduce={Boolean(reduce)}
              />
            ))}

            {/* Single recoloured reveal spanning the whole column, shown inside the
                cursor mask — one layer so the circle flows across quote boundaries. */}
            {!reduce && (
              <div
                ref={revealRef}
                aria-hidden="true"
                inert
                className="hero-reveal pointer-events-none absolute inset-y-0 z-[30] [&_*]:!text-[var(--color-background)]"
                style={{
                  left: "-50vw",
                  right: "-50vw",
                  paddingLeft: "50vw",
                  paddingRight: "50vw",
                }}
              >
                {items.map((t, i) => (
                  <QuoteReveal key={t.name} t={t} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Sticky avatar rail — pinned full-height so the avatars stay vertically
              centred in the viewport while the quotes scroll; lights the active one. */}
          <ul className="sticky top-0 hidden h-screen flex-col justify-center gap-6 self-start sm:flex">
            {items.map((t, i) => {
              const isActive = i === active;
              return (
                <li key={t.name} className="relative">
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute -left-4 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[6px] border-r-[8px] border-y-transparent border-r-[var(--color-accent-2)]"
                    />
                  ) : null}
                  <Avatar name={t.name} active={isActive} className="h-20 w-20 text-2xl" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
