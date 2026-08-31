"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { content } from "@/lib/content";

const DURATION = 1300;

/**
 * Full-screen loading overlay with a 0→100% counter, then it slides away.
 * The page renders underneath (SSR/SEO intact). Plays on every load; skips
 * instantly under reduced motion. Decorative → aria-hidden.
 *
 * The cover can never get stuck: besides the rAF counter, a setTimeout failsafe
 * always dismisses it (rAF is paused in a backgrounded tab), and a CSS failsafe
 * (.preloader in globals.css) hides it even if the client JS never hydrates.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const copy = content;
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduced) {
      setCount(100);
      setVisible(false);
      return;
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = requestAnimationFrame(() => setVisible(false));
      }
    };
    raf = requestAnimationFrame(tick);

    // Failsafe: guarantee the cover lifts even if rAF is throttled/paused (e.g.
    // the tab loads in the background), where the counter would never advance.
    const failsafe = setTimeout(() => {
      setCount(100);
      setVisible(false);
    }, DURATION + 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
    };
  }, [reduced]);

  // Lock scroll while the overlay is up.
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          className="preloader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-background)]"
          initial={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={{
            duration: reduced ? 0.2 : 0.75,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <span className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--color-muted)]">
            {copy.brand}
          </span>
          <span className="mt-3 text-7xl font-semibold tabular-nums tracking-tight text-[var(--color-foreground)] sm:text-8xl">
            {count}
            <span className="text-[var(--color-accent-2)]">%</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
