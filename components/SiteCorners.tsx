import { siDribbble, siYoutube, siInstagram } from "simple-icons";
import { content } from "@/lib/content";
import ExternalLink from "./ExternalLink";
import Magnetic from "./Magnetic";

// LinkedIn was dropped from simple-icons (trademark), so carry its glyph inline.
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z";

// Brand-icon paths for the social bar, matched to content.contact.socials by
// label. Server component → simple-icons stays out of the client bundle.
const ICONS: Record<string, string> = {
  dribbble: siDribbble.path,
  youtube: siYoutube.path,
  linkedin: LINKEDIN_PATH,
  instagram: siInstagram.path,
};

/**
 * Fixed viewport-corner overlays (like the reference's pinned footer): social
 * icons bottom-left, a "Let's talk" link bottom-right. Desktop only; sits under
 * the preloader (z-100) and custom cursor (z-90) but above page content.
 */
export default function SiteCorners() {
  const { contact, hero } = content;

  // Two-tone CTA like the reference's "Sound On" control: first word dim grey,
  // the rest tan.
  const [ctaLead, ...ctaRestWords] = hero.primaryCta.label.split(" ");
  const ctaRest = ctaRestWords.join(" ");

  return (
    <>
      {/* Bottom-left — social icons */}
      <ul className="fixed bottom-6 left-6 z-40 hidden flex-col items-start gap-6 md:flex">
        {contact.socials.map((s) => {
          const iconPath = ICONS[s.label.toLowerCase()];
          if (!iconPath) return null;
          return (
            <li key={s.label}>
              <Magnetic strength={0.55} radius={30}>
                <ExternalLink
                  href={s.href}
                  data-cursor
                  aria-label={s.label}
                  className="grid place-items-center rounded-full p-2.5 text-[var(--color-foreground)] transition-colors duration-300 group-data-[active=true]/mag:bg-[var(--color-accent-2)] group-data-[active=true]/mag:text-[var(--color-on-accent-2)]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-[18px] w-[18px] fill-current"
                  >
                    <path d={iconPath} />
                  </svg>
                </ExternalLink>
              </Magnetic>
            </li>
          );
        })}
      </ul>

      {/* Bottom-right — vertical "Let's talk" (in place of the reference's sound toggle).
          Colours match that control: dim grey at rest → tan on hover. text-orientation:
          sideways rotates every glyph uniformly; rotate-180 turns the vertical-rl rotate(90°)
          into rotate(270°) ≡ rotate(-90°) so it reads bottom-to-top like the reference. */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <ExternalLink
          href={hero.primaryCta.href}
          data-cursor
          className="group block rotate-180 text-sm font-bold uppercase tracking-wide [writing-mode:vertical-rl] [text-orientation:sideways]"
        >
          {/* Horizontal roll on hover: "lets" stays the inactive-nav colour in both
              copies; only "talk" changes — green at rest → nav-inactive on hover. */}
          <span className="relative block overflow-hidden">
            <span className="block transition-transform duration-300 ease-out group-hover:-translate-x-full">
              <span className="text-[var(--color-nav-inactive)]">{ctaLead}</span>
              {ctaRest ? (
                <span className="text-[var(--color-accent-2)]"> {ctaRest}</span>
              ) : null}
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 block translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0"
            >
              <span className="text-[var(--color-nav-inactive)]">{ctaLead}</span>
              {ctaRest ? (
                <span className="text-[var(--color-nav-inactive)]"> {ctaRest}</span>
              ) : null}
            </span>
          </span>
        </ExternalLink>
      </div>
    </>
  );
}
