"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** vertical drift in % of element height as it passes through the viewport */
  amount?: number;
};

/**
 * Subtle vertical parallax tied to scroll progress. Best for decorative layers
 * (orbs, images). No movement under reduced motion.
 */
export default function Parallax({ children, className, amount = 12 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : [`${amount}%`, `${-amount}%`],
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
