"use client";

import { content } from "@/lib/content";
import ExternalLink from "./ExternalLink";
import Reveal from "./Reveal";

/**
 * Compact contact line (email / phone). Over the shared green-fill sweep, the
 * small label swaps to a witty note on hover — matching the reference, where
 * "Email" becomes "100% chance I read it". The value stays and just brightens.
 * Hover is gated to sm: so touch shows the plain label + value.
 */
function ContactLine({
  href,
  label,
  value,
  note,
}: {
  href: string;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <ExternalLink
      href={href}
      data-cursor
      className="group relative block overflow-visible px-3 py-1"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -inset-y-1 origin-center scale-y-0 bg-[var(--color-accent-2)] transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:group-hover:scale-y-100"
      />
      {/* Label line: crossfades to the witty note on hover (matches the reference's
          ~11.85px/700 label; the value below is ~10.4px/400 with no gap). */}
      <span className="relative block h-[1.3em] text-xs font-bold leading-tight text-[var(--color-foreground)]">
        <span className="block whitespace-nowrap transition-opacity duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:group-hover:opacity-0">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block whitespace-nowrap text-[var(--color-bright)] opacity-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:group-hover:opacity-100"
        >
          {note}
        </span>
      </span>
      <span className="relative block text-[10.5px] leading-snug text-[var(--color-muted)] transition-colors duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:group-hover:text-[var(--color-bright)]">
        {value}
      </span>
    </ExternalLink>
  );
}

export default function Contact() {
  const { brand, contact } = content;
  const tel = `tel:${contact.phone.replace(/[^+\d]/g, "")}`;
  const year = 2026; // static; bump as needed

  return (
    <footer
      id="contact"
      className="full-bleed relative overflow-hidden border-t border-[var(--color-border)] py-24 sm:py-32"
    >
      <div className="px-5 sm:px-8 md:px-36 lg:px-40">
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

        {/* Socials — two-column grid; each cell reuses the "What I do" hover: a
            green panel sweeps open from the centre, the label brightens/slides, and
            the note reveals. Hover gated to sm: so touch shows label + note statically. */}
        <ul className="mt-16 grid grid-cols-1 gap-x-12 gap-y-0 lg:grid-cols-2">
          {contact.socials.map((s, i) => (
            <li key={s.label}>
              <Reveal delay={i * 0.05}>
                <ExternalLink
                  href={s.href}
                  data-cursor
                  className="group relative flex items-center overflow-visible px-3 text-[var(--color-foreground)]"
                >
                  {/* Rows sit tight (line-height only, like the reference); the fill bar
                      extends a touch beyond the text via -inset-y so the hover highlight
                      isn't cramped — mirrors the reference's padded reveal. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 -inset-y-1 origin-center scale-y-0 bg-[var(--color-accent-2)] transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:group-hover:scale-y-100"
                  />
                  {/* Marker + label slide together on hover */}
                  <span className="relative flex items-center gap-3 transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:group-hover:translate-x-2">
                    {/* Inverted right-angle bullet (matches the reference's contact-link mark) */}
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                      className="h-[9px] w-[9px] shrink-0 fill-[var(--color-accent-2)] transition-colors duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:group-hover:fill-[var(--color-bright)]"
                    >
                      <path d="M0 0H12V12L6.5 6L0 0Z" />
                    </svg>
                    {/* Name swaps to the witty note in place on hover (like the
                        reference) — same size, same spot, so they never overlap. */}
                    <span className="relative block whitespace-nowrap text-2xl font-bold leading-none tracking-[-0.03em] sm:text-3xl">
                      <span className="block transition-opacity duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:group-hover:opacity-0">
                        {s.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 block text-[var(--color-bright)] opacity-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:group-hover:opacity-100"
                      >
                        {s.note}
                      </span>
                    </span>
                  </span>
                </ExternalLink>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Compact email / phone — the small label swaps to a witty note on hover.
            Same column gaps as the socials grid so the two columns line up vertically. */}
        <Reveal>
          <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-2">
            <ContactLine
              href={`mailto:${contact.email}`}
              label="Email"
              value={contact.email}
              note={contact.emailNote}
            />
            <ContactLine
              href={tel}
              label="Phone"
              value={contact.phone}
              note={contact.phoneNote}
            />
          </div>
        </Reveal>

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
