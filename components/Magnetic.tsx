"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type Props = {
  children: React.ReactNode;
  /** how strongly the element pulls toward the cursor (0–1) */
  strength?: number;
  /** activation radius (px) around the element within which the pull engages */
  radius?: number;
  /** how far (px) beyond the element the effect starts */
  padding?: number;
  className?: string;
};

/**
 * Wraps an element so it drifts toward the cursor (magnetic), springing back on
 * leave. With `radius`, the pointer is tracked across the window so the pull
 * reaches out beyond the element without static padding. Exposes `data-active`
 * (a `group/mag`) that turns on when the element is hovered and stays on until
 * the spring has fully returned to rest — so a hover fill keyed off it lingers
 * for the whole magnetic animation instead of vanishing on pointer-leave.
 * Disabled under reduced motion.
 */
export default function Magnetic({
  children,
  strength = 0.4,
  radius = 0,
  padding = 0,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Softer, slower spring so the element eases toward the cursor.
  const sx = useSpring(x, { stiffness: 120, damping: 14, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 120, damping: 14, mass: 0.5 });
  const [active, setActive] = useState(false);
  const within = useRef(false);

  // Radius mode: follow the pointer anywhere within `radius` of the centre, and
  // keep `active` on until the spring has settled back to rest — so a hover fill
  // keyed off it doesn't disappear before the magnetic motion finishes.
  useEffect(() => {
    if (reduced || !radius) return;
    // Drop `active` once the pointer has left the radius AND the spring is at rest.
    const maybeSettle = () => {
      if (!within.current && Math.abs(sx.get()) < 0.5 && Math.abs(sy.get()) < 0.5) {
        setActive(false);
      }
    };
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Measure from the element's REST centre (strip the live spring offset),
      // otherwise the moving rect feeds back and extends the effective radius.
      const dx = e.clientX - (r.left + r.width / 2 - sx.get());
      const dy = e.clientY - (r.top + r.height / 2 - sy.get());
      const inside = Math.hypot(dx, dy) < radius;
      within.current = inside;
      x.set(inside ? dx * strength : 0);
      y.set(inside ? dy * strength : 0);
      if (!inside) maybeSettle();
    };
    const onLeaveWindow = () => {
      within.current = false;
      x.set(0);
      y.set(0);
      maybeSettle();
    };
    const u1 = sx.on("change", maybeSettle);
    const u2 = sy.on("change", maybeSettle);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      u1();
      u2();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, [radius, strength, reduced, x, y, sx, sy]);

  // Local fallback (no radius): pull only while the pointer is over the element.
  const onLocalMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || radius) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2 - sx.get())) * strength);
    y.set((e.clientY - (r.top + r.height / 2 - sy.get())) * strength);
  };
  const onEnter = () => setActive(true);
  const onLeave = () => {
    // Radius mode lets the spring-settle effect switch `active` off at rest;
    // otherwise (local / reduced motion) drop it immediately.
    if (reduced || !radius) {
      setActive(false);
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      ref={ref}
      data-active={active ? "true" : undefined}
      onPointerMove={onLocalMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy, padding }}
      className={["group/mag", className].filter(Boolean).join(" ")}
    >
      {children}
    </motion.div>
  );
}
