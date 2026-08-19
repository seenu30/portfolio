"use client";

import { type RefObject, useEffect } from "react";

/**
 * Pointer-following "reveal" circle used over a content block: a recoloured
 * duplicate (the `layer`) is shown only inside a circle whose centre + radius
 * lerp toward the pointer every frame (this easing — not a spring — is what makes
 * it glide). The circle grows on enter, shrinks on leave. Writes the mask vars
 * (--hero-x/y/r) onto `layer` and toggles `reveal-active` on <html> so the
 * custom-cursor follower hides (one circle). Fine pointers only; disabled under
 * reduced motion.
 */
export function useRevealCircle(
  target: RefObject<HTMLElement | null>,
  layer: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const el = target.current;
    const lyr = layer.current;
    if (!el || !lyr) return;

    let raf = 0;
    let tx = 0,
      ty = 0,
      tr = 0; // targets
    let cx = 0,
      cy = 0,
      cr = 0; // current

    const rel = (e: PointerEvent) => {
      const r = lyr.getBoundingClientRect();
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
      document.documentElement.classList.add("reveal-active");
    };
    const onLeave = () => {
      tr = 0;
      document.documentElement.classList.remove("reveal-active");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    const tick = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      cr += (tr - cr) * 0.06;
      lyr.style.setProperty("--hero-x", `${cx.toFixed(1)}px`);
      lyr.style.setProperty("--hero-y", `${cy.toFixed(1)}px`);
      lyr.style.setProperty("--hero-r", `${cr.toFixed(1)}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("reveal-active");
    };
  }, [target, layer]);
}
