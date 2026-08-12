"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type Props = {
  value: number;
  suffix?: string;
  label: string;
};

/**
 * A single stat that counts up from 0 the first time it scrolls into view.
 * SSR renders the FINAL number (correct for crawlers / no-JS and avoids a
 * hydration mismatch); the count-up only runs client-side, and reduced-motion
 * users just see the final value.
 */
export default function StatCounter({ value, suffix = "", label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduced || !inView) return;
    setDisplay(0);
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.2, 0.65, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <div
      ref={ref}
      data-cursor
      className="group transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="flex items-baseline text-4xl font-semibold leading-none tracking-tight transition-colors duration-300 group-hover:text-[var(--color-accent-2)] sm:text-5xl">
        <span>{display}</span>
        {suffix ? <span className="text-[var(--color-muted)]">{suffix}</span> : null}
      </div>
      <p className="mt-2 text-sm text-[var(--color-subtle)]">{label}</p>
    </div>
  );
}
