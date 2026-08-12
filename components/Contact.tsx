"use client";

import { content } from "@/lib/content";
import ExternalLink from "./ExternalLink";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

export default function Contact() {
  const { brand, contact } = content;
  const tel = `tel:${contact.phone.replace(/[^+\d]/g, "")}`;
  const year = 2026; // static; bump as needed

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-[var(--color-border)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-accent-2)]">
              {contact.kicker}
            </p>
            <h2
              className="display mt-4 text-5xl font-semibold sm:text-7xl lg:text-8xl"
            >
              {contact.title}
            </h2>
          </Reveal>

          {/* Rotating text ring */}
          <Reveal className="shrink-0">
            <div className="relative hidden h-28 w-28 sm:block" aria-hidden="true">
              <svg viewBox="0 0 100 100" className="text-ring h-full w-full">
                <defs>
                  <path
                    id="contact-ring"
                    d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                  />
                </defs>
                <text className="fill-[var(--color-muted)] text-[10px] uppercase tracking-[0.25em]">
                  <textPath href="#contact-ring">
                    Get in touch • Get in touch •
                  </textPath>
                </text>
              </svg>
              <span className="absolute inset-0 grid place-items-center text-xl text-[var(--color-foreground)]">
                ↗
              </span>
            </div>
          </Reveal>
        </div>

        {/* Details */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
          <Reveal className="space-y-8">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Email</p>
              <Magnetic strength={0.25} className="inline-block">
                <ExternalLink
                  href={`mailto:${contact.email}`}
                  data-cursor
                  className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)] underline-offset-4 hover:underline sm:text-3xl"
                >
                  {contact.email}
                </ExternalLink>
              </Magnetic>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted)]">Phone</p>
              <ExternalLink
                href={tel}
                data-cursor
                className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)] underline-offset-4 hover:underline sm:text-3xl"
              >
                {contact.phone}
              </ExternalLink>
            </div>
          </Reveal>

          <Reveal>
            <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {contact.socials.map((s) => (
                <li key={s.label}>
                  <ExternalLink
                    href={s.href}
                    data-cursor
                    className="group flex items-center justify-between py-4 text-[var(--color-foreground)]"
                  >
                    <span className="text-lg font-medium transition-transform duration-300 group-hover:translate-x-2">
                      {s.label}
                    </span>
                    <span className="text-sm text-[var(--color-muted)]">
                      {s.note}
                    </span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Baseline */}
        <div className="mt-16 flex flex-col gap-2 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {brand}
          </span>
          <span>Built with intent.</span>
        </div>
      </div>
    </footer>
  );
}
