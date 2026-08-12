"use client";

import { type RefObject, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { content } from "@/lib/content";
import ExternalLink from "./ExternalLink";
import HoverButton from "./HoverButton";

type Props = {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export default function MobileMenu({ open, onClose, triggerRef }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const copy = content;

  // Body scroll lock + scrollbar-width compensation (no layout jump).
  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [open]);

  // Focus first link on open; trap Tab; Esc closes; restore focus to trigger on close.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const getFocusable = () =>
      panelRef.current
        ? Array.from(
            panelRef.current.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          )
        : [];

    getFocusable()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
  };
  const itemVariants = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 14 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.2, 0.65, 0.3, 1] as const },
        },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* Opaque sheet that also closes the menu when tapped. */}
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-[var(--color-background)]"
          />

          <motion.nav
            aria-label="Mobile"
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="relative flex h-full flex-col justify-between px-5 pb-10 pt-[calc(var(--nav-h)+2rem)]"
          >
            <ul className="flex flex-col">
              {copy.nav.links.map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="block border-b border-[var(--color-border)] py-4 font-serif text-4xl italic tracking-tight text-[var(--color-foreground)]"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div variants={itemVariants} className="space-y-7">
              <HoverButton
                href={copy.hero.primaryCta.href}
                label={copy.hero.primaryCta.label}
                variant="primary"
                className="w-full"
              />
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {copy.contact.socials.map((s) => (
                  <ExternalLink
                    key={s.label}
                    href={s.href}
                    className="text-sm text-[var(--color-subtle)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    {s.label}
                  </ExternalLink>
                ))}
              </div>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
