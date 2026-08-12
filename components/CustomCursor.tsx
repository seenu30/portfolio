"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

type CursorState = "idle" | "contract" | "expand" | "view" | "drag";

/**
 * Size + opacity per state. Matches the reference (minhpham.design), which was
 * measured to keep ONE constant colour and animate only size + opacity:
 * idle → hidden (opacity 0), grows to ~120px over content, tiny over links.
 */
const STATES: Record<
  CursorState,
  { size: number; opacity: number; label?: string }
> = {
  idle: { size: 8, opacity: 0 },
  contract: { size: 6, opacity: 1 },
  expand: { size: 120, opacity: 1 },
  view: { size: 72, opacity: 1, label: "View" },
  drag: { size: 72, opacity: 1, label: "Drag" },
};

// One constant colour everywhere (`--color-accent-2`); the label text colour differs
// so View/Drag stay readable.
const CLASS: Record<CursorState, string> = {
  idle: "bg-[var(--color-accent-2)] text-transparent",
  contract: "bg-[var(--color-accent-2)] text-transparent",
  expand: "bg-[var(--color-accent-2)] text-transparent",
  view: "bg-[var(--color-accent-2)] text-white",
  drag: "bg-[var(--color-accent-2)] text-white",
};

/**
 * Context-aware custom cursor (Minh-Pham-style). A single round follower that:
 *  - contracts to a precise dot over links/buttons,
 *  - expands into a large disc over content/media ([data-cursor="expand"]),
 *  - becomes a labelled disc over special areas ([data-cursor="view"|"drag"]),
 *  - fades out (opacity 0) over plain background.
 * Desktop/fine-pointer only, disabled under reduced motion, native cursor hidden.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("idle");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest<HTMLElement>("[data-cursor], a, button");
      if (!el) {
        setState("idle");
        return;
      }
      const v = el.dataset.cursor;
      if (v === "expand" || v === "view" || v === "drag" || v === "contract") {
        setState(v);
      } else {
        // bare data-cursor, or a plain link/button → precise contract
        setState("contract");
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const cfg = STATES[state];

  return (
    <motion.div
      aria-hidden="true"
      className="custom-cursor-root pointer-events-none fixed left-0 top-0 z-[90] hidden transition-opacity duration-200 md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[11px] font-semibold uppercase tracking-wide ${CLASS[state]}`}
        animate={{ width: cfg.size, height: cfg.size, opacity: cfg.opacity }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {cfg.label ? (
            <motion.span
              key={cfg.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
            >
              {cfg.label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
