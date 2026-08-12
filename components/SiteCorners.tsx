import { siDribbble, siYoutube, siInstagram } from "simple-icons";
import { content } from "@/lib/content";
import ExternalLink from "./ExternalLink";

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

  return (
    <>
      {/* Bottom-left — social icons */}
      <ul className="fixed bottom-5 left-5 z-40 hidden flex-col items-start gap-4 md:flex">
        {contact.socials.map((s) => {
          const iconPath = ICONS[s.label.toLowerCase()];
          if (!iconPath) return null;
          return (
            <li key={s.label}>
              <ExternalLink
                href={s.href}
                data-cursor
                aria-label={s.label}
                className="block text-[var(--color-foreground)] transition-colors duration-200 hover:text-[var(--color-accent-2)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-[18px] w-[18px] fill-current"
                >
                  <path d={iconPath} />
                </svg>
              </ExternalLink>
            </li>
          );
        })}
      </ul>

      {/* Bottom-right — vertical "Let's talk" (in place of the reference's sound toggle) */}
      <div className="fixed bottom-5 right-5 z-40 hidden md:block">
        <ExternalLink
          href={hero.primaryCta.href}
          data-cursor
          className="block text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-foreground)] transition-colors duration-200 [writing-mode:vertical-rl] hover:text-[var(--color-accent-2)]"
        >
          {hero.primaryCta.label}
        </ExternalLink>
      </div>
    </>
  );
}
