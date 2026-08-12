"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import Logo from "./Logo";
import Magnetic from "./Magnetic";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const copy = content;
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Scroll-spy: mark the nav link whose section is currently in view as active.
  // "Active" = the last nav-target section whose top has crossed a line ~35% down
  // the viewport, so intermediate sections (services, experience…) keep the nearest
  // preceding nav item lit rather than blanking the whole nav.
  useEffect(() => {
    const targets = copy.nav.links
      .map((l) => ({ href: l.href, el: document.querySelector<HTMLElement>(l.href) }))
      .filter((t): t is { href: string; el: HTMLElement } => Boolean(t.el));
    if (!targets.length) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const t of targets) {
        if (t.el.getBoundingClientRect().top <= line) current = t.href;
      }
      setActiveHref(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [copy.nav.links]);

  return (
    <>
      <header className="nav-enter fixed inset-x-0 top-0 z-50">
        <nav aria-label="Primary" className="bg-transparent">
          <div className="flex w-full items-start justify-between px-6 pt-6">
            {/* Logo mark — magnetic pull; a tan circle fills behind it on hover, icon inverts */}
            <Magnetic strength={0.55} radius={130}>
              <a
                href="#top"
                aria-label={copy.brand}
                data-cursor
                className="grid place-items-center rounded-full p-2 text-[var(--color-foreground)] transition-colors duration-300 group-data-[active=true]/mag:bg-[var(--color-accent-2)] group-data-[active=true]/mag:text-[var(--color-on-accent-2)]"
              >
                <Logo className="h-[18px] w-[18px]" />
              </a>
            </Magnetic>

            {/* Right group — links pushed right (logo pins left), then mobile toggle */}
            <div className="flex flex-col items-end gap-2">
              {/* Desktop links (vertical column) with a roll-up duplicate-text hover */}
              <ul className="hidden flex-col items-end gap-1 md:flex">
                {copy.nav.links.map((link) => {
                  const active = activeHref === link.href;
                  return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      data-cursor
                      aria-current={active ? "true" : undefined}
                      className="group relative block rounded-sm text-sm font-bold uppercase tracking-wide text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
                    >
                      {/* Reference behaviour: same tan hue, two stacked copies — the front copy
                          is dimmed (50% opacity), the back copy full. Inactive shows the dim
                          copy; on hover/active it rolls to reveal the full-opacity copy, so the
                          ACTIVE section's link reads brighter without any colour change. */}
                      <span className="relative block h-[1.25em] overflow-hidden">
                        <span
                          className={`block opacity-50 transition-transform duration-300 ease-out group-hover:-translate-y-full ${
                            active ? "-translate-y-full" : ""
                          }`}
                        >
                          {link.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`absolute inset-0 block transition-transform duration-300 ease-out group-hover:translate-y-0 ${
                            active ? "translate-y-0" : "translate-y-full"
                          }`}
                        >
                          {link.label}
                        </span>
                      </span>
                    </a>
                  </li>
                  );
                })}
              </ul>

              {/* Mobile toggle — hamburger morphs to X */}
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                data-cursor
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] md:hidden"
              >
                <span className="relative block h-4 w-5" aria-hidden="true">
                  <span
                    className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-300 ${
                      open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[3px]"
                    }`}
                  />
                  <span
                    className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-300 ${
                      open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-[3px]"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} />
    </>
  );
}
