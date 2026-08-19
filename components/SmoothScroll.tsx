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
      duration: 1.1,
      // easeOutExpo — quick take-off, long glide to a stop (the reference feel).
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
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
