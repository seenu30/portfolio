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
  options?: { activeSelector?: string },
) {
  const activeSelector = options?.activeSelector;
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
    let on = false;

    const rel = (e: PointerEvent) => {
      const r = lyr.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    // With an activeSelector the circle only shows while the pointer is over a
    // matching element (the text), not the whole target container.
    const overActive = (e: PointerEvent) =>
      !activeSelector ||
      (e.target instanceof Element && !!e.target.closest(activeSelector));
    const grow = (p: { x: number; y: number }) => {
      if (!on) {
        on = true;
        cx = tx = p.x;
        cy = ty = p.y; // jump centre to pointer so it doesn't sweep in from 0,0
      }
      tr = 150;
      document.documentElement.classList.add("reveal-active");
    };
    const shrink = () => {
      on = false;
      tr = 0;
      document.documentElement.classList.remove("reveal-active");
    };

    const onMove = (e: PointerEvent) => {
      const p = rel(e);
      tx = p.x;
      ty = p.y;
      if (overActive(e)) grow(p);
      else shrink();
    };
    const onEnter = (e: PointerEvent) => {
      if (overActive(e)) grow(rel(e));
    };
    const onLeave = () => shrink();

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
  }, [target, layer, activeSelector]);
}
