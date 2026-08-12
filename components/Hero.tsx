"use client";

import { type CSSProperties, type Ref, useEffect, useRef } from "react";
import { content } from "@/lib/content";
import AnimatedText from "./AnimatedText";
import HoverButton from "./HoverButton";
import StatCounter from "./StatCounter";
import Magnetic from "./Magnetic";
import Parallax from "./Parallax";

const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties;

type HeroCopy = typeof content.hero;

/**
 * The hero text block. Rendered twice: once as the real content, once (reveal)
 * as a recoloured duplicate shown through the cursor mask. `reveal` renders the
 * name statically (no per-letter animation) as a <div> so it aligns pixel-for-
 * pixel with the base and adds no second <h1>.
 */
function HeroInner({
  hero,
  reveal = false,
  innerRef,
}: {
  hero: HeroCopy;
  reveal?: boolean;
  innerRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={innerRef}
      className="mx-auto flex w-full max-w-5xl flex-col items-center px-5 text-center sm:px-8"
    >
      {/* Badge */}
      <div
        className="reveal-up inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-1.5 text-sm text-[var(--color-subtle)]"
        style={delay(0)}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent-2)] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent-2)]" />
        </span>
        {hero.badge}
      </div>

      {/* Big name */}
      <AnimatedText
        segments={hero.headline}
        baseDelay={0.12}
        step={0.03}
        noAnimation={reveal}
        as={reveal ? "div" : "h1"}
        className="display mt-6 text-7xl font-semibold sm:text-8xl lg:text-[9rem]"
      />

      {/* Tagline */}
      <p
        className="reveal-up mt-5 text-xl font-medium text-[var(--color-foreground)] sm:text-2xl"
        style={delay(0.5)}
      >
        {hero.tagline}
      </p>

      {/* Intro */}
      <p
        className="reveal-up mt-4 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-subtle)] sm:text-lg"
        style={delay(0.62)}
      >
        {hero.intro}
      </p>

      {/* CTAs (magnetic) */}
      <div
        className="reveal-up mt-9 flex flex-col items-center gap-3 sm:flex-row"
        style={delay(0.74)}
      >
        <Magnetic strength={0.45}>
          <HoverButton
            href={hero.primaryCta.href}
            label={hero.primaryCta.label}
            variant="primary"
          />
        </Magnetic>
        <Magnetic strength={0.45}>
          <HoverButton
            href={hero.secondaryCta.href}
            label={hero.secondaryCta.label}
            variant="outline"
          />
        </Magnetic>
      </div>

      {/* Stats */}
      <div
        className="reveal-up mt-16 grid w-full max-w-lg grid-cols-3 gap-6"
        style={delay(0.88)}
      >
        {hero.stats.map((stat) => (
          <StatCounter
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const { hero } = content;
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Smooth "reveal" circle: lerp the mask's centre + radius toward the pointer
  // every frame (this easing — not a spring — is what makes it glide). The circle
  // only grows while the pointer is over the CONTENT block, not the whole section.
  // Fine pointers only; disabled under reduced motion.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const target = contentRef.current;
    const layer = revealRef.current;
    if (!target || !layer) return;

    let raf = 0;
    let tx = 0,
      ty = 0,
      tr = 0; // targets
    let cx = 0,
      cy = 0,
      cr = 0; // current

    const rel = (e: PointerEvent) => {
      const r = layer.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = rel(e);
      tx = p.x;
      ty = p.y;
    };
    const onEnter = (e: PointerEvent) => {
      const p = rel(e);
      cx = tx = p.x;
      cy = ty = p.y; // jump centre to pointer so it doesn't sweep in from 0,0
      tr = 150;
      document.documentElement.classList.add("in-hero");
    };
    const onLeave = () => {
      tr = 0;
      document.documentElement.classList.remove("in-hero");
    };

    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerenter", onEnter);
    target.addEventListener("pointerleave", onLeave);

    const tick = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      cr += (tr - cr) * 0.12;
      layer.style.setProperty("--hero-x", `${cx.toFixed(1)}px`);
      layer.style.setProperty("--hero-y", `${cy.toFixed(1)}px`);
      layer.style.setProperty("--hero-r", `${cr.toFixed(1)}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerenter", onEnter);
      target.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("in-hero");
    };
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-[calc(var(--nav-h)+2rem)] pb-20"
    >
      {/* Decorative parallax orb behind the name */}
      <Parallax
        amount={16}
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 flex justify-center"
      >
        <div className="orb h-[34rem] w-[34rem] opacity-70" />
      </Parallax>

      {/* Base content */}
      <HeroInner hero={hero} innerRef={contentRef} />

      {/* Recoloured reveal, shown only inside the cursor mask (see .hero-reveal) */}
      <div
        ref={revealRef}
        aria-hidden="true"
        inert
        className="hero-reveal pointer-events-none absolute inset-0 z-[1] flex flex-col justify-center pt-[calc(var(--nav-h)+2rem)] pb-20 [&_*]:!text-[var(--color-background)]"
      >
        <HeroInner hero={hero} reveal />
      </div>
    </section>
  );
}
