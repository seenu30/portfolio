"use client";

import { type CSSProperties, type Ref, useRef } from "react";
import { content } from "@/lib/content";
import AnimatedText from "./AnimatedText";
import Parallax from "./Parallax";
import { useRevealCircle } from "./useRevealCircle";

const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties;

type HeroCopy = typeof content.hero;

/**
 * The hero text block — a small eyebrow name + one oversized statement headline
 * (two words in the accent). Rendered twice: once as the real content, once
 * (reveal) as a recoloured duplicate shown through the cursor mask. `reveal`
 * renders the headline statically (no per-letter animation) as a <div> so it
 * aligns pixel-for-pixel with the base and adds no second <h1>.
 */
function HeroInner({
  hero,
  brand,
  reveal = false,
  innerRef,
}: {
  hero: HeroCopy;
  brand: string;
  reveal?: boolean;
  innerRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={innerRef}
      className="mx-auto flex w-full max-w-[33.6rem] flex-col items-center px-5 text-center sm:px-8"
    >
      {/* Eyebrow name */}
      <p
        className="reveal-up text-sm font-bold uppercase tracking-[0.5em] text-[var(--color-foreground)]"
        style={delay(0)}
      >
        {brand}
      </p>

      {/* Big statement headline */}
      <AnimatedText
        segments={hero.headline}
        baseDelay={0.12}
        step={0.03}
        noAnimation={reveal}
        as={reveal ? "div" : "h1"}
        className="display mt-6 text-6xl font-bold uppercase sm:text-8xl lg:text-[7rem]"
      />
    </div>
  );
}

export default function Hero() {
  const { hero, brand } = content;
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Pointer-following reveal circle over the hero content (shared with About).
  useRevealCircle(contentRef, revealRef);

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
      <HeroInner hero={hero} brand={brand} innerRef={contentRef} />

      {/* Recoloured reveal, shown only inside the cursor mask (see .hero-reveal) */}
      <div
        ref={revealRef}
        aria-hidden="true"
        inert
        className="hero-reveal pointer-events-none absolute inset-0 z-[1] flex flex-col justify-center pt-[calc(var(--nav-h)+2rem)] pb-20 [&_*]:!text-[var(--color-background)]"
      >
        <HeroInner hero={hero} brand={brand} reveal />
      </div>
    </section>
  );
}
