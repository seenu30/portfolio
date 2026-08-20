"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertia smooth-scroll (like the reference minhpham.design, which lerps the
 * scroll position each frame). Lenis drives the *real* window scroll, so native
 * scroll events still fire and Framer Motion's useScroll keeps working. Disabled
 * under reduced motion, where the native system scroll is left untouched.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // Lerp-based smoothing: each frame eases a fixed fraction of the remaining
      // distance, so it's continuous and even (smoother than a long easeOutExpo
      // tail). A low lerp gives a heavier, longer glide, and wheelMultiplier < 1
      // shortens the travel per tick — together a slow, buttery scroll.
      lerp: 0.05, // lower = smoother/heavier glide (0.1 is Lenis default)
      wheelMultiplier: 0.35, // < 1 = slower travel per wheel notch (the main "slow" knob)
      smoothWheel: true,
      touchMultiplier: 1,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
