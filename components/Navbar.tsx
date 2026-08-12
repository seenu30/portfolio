"use client";

import { useRef, useState } from "react";
import { content } from "@/lib/content";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const copy = content;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className="nav-enter fixed inset-x-0 top-0 z-50">
        <nav aria-label="Primary" className="bg-transparent">
          <div className="mx-auto flex max-w-6xl items-start justify-between px-5 pt-6 sm:px-8">
            {/* Logo mark */}
            <a
              href="#top"
              aria-label={copy.brand}
              data-cursor
              className="block text-[var(--color-foreground)] transition-colors duration-200 hover:text-[var(--color-accent-2)]"
            >
              <Logo />
            </a>

            {/* Right group — links pushed right (logo pins left), then mobile toggle */}
            <div className="flex flex-col items-end gap-2">
              {/* Desktop links (vertical column) with a roll-up duplicate-text hover */}
              <ul className="hidden flex-col items-end gap-1 md:flex">
                {copy.nav.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      data-cursor
                      className="group relative block rounded-sm text-xs font-semibold uppercase tracking-wide text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
                    >
                      <span className="relative block h-[1.25em] overflow-hidden">
                        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                          {link.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
                        >
                          {link.label}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
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
