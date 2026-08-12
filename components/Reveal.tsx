"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** seconds before the reveal starts */
  delay?: number;
  /** px it rises from */
  y?: number;
};

/**
 * Fade + rise when scrolled into view (once). Under reduced motion it renders
 * statically with no transform. Don't wrap the hero LCP heading in this — it
 * starts at opacity 0. Good for below-the-fold sections.
 */
export default function Reveal({ children, className, delay = 0, y = 24 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduced ? undefined : { opacity: 0, y }}
      animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
