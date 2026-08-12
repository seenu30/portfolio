"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type Props = {
  children: React.ReactNode;
  /** how strongly the element pulls toward the cursor (0–1) */
  strength?: number;
  /** how far (px) beyond the element the effect starts */
  padding?: number;
  className?: string;
};

/**
 * Wraps an element so it drifts toward the cursor while hovered (magnetic).
 * Springs back on leave. Disabled under reduced motion.
 */
export default function Magnetic({
  children,
  strength = 0.4,
  padding = 0,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy, padding }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
