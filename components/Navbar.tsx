"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import HoverButton from "./HoverButton";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const copy = content;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="nav-enter fixed inset-x-0 top-0 z-50">
        <nav
          aria-label="Primary"
          className={`transition-colors duration-300 ${
            scrolled
              ? "border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-background),transparent_30%)] backdrop-blur-md"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <div className="mx-auto flex h-[var(--nav-h)] max-w-6xl items-center justify-between px-5 sm:px-8">
            {/* Wordmark */}
            <a
              href="#top"
              data-cursor
              className="text-lg font-semibold tracking-tight text-[var(--color-foreground)]"
            >
              {copy.brand}
            </a>

            {/* Desktop links */}
            <ul className="hidden items-center gap-9 md:flex">
              {copy.nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-cursor
                    className="text-sm text-[var(--color-subtle)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right cluster */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <HoverButton
                  href={copy.hero.primaryCta.href}
                  label={copy.hero.primaryCta.label}
                  variant="primary"
                  className="!px-5 !py-2.5"
                />
              </div>

              {/* Mobile toggle — hamburger morphs to X */}
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                data-cursor
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)] md:hidden"
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
