/**
 * Single source of editable content for the site.
 * Swap these placeholders for your real details — this is the only file to edit.
 * No secrets here (it ships to the browser). Every href is rendered through
 * <ExternalLink>, which enforces an https / mailto / tel scheme allowlist.
 */

export type NavLink = { label: string; href: string };
export type HeadlineSegment = { text: string; emphasis: boolean };
export type Stat = { value: number; suffix?: string; label: string };
export type Service = { label: string; desc: string };
export type Job = { year: string; role: string; org: string };
export type Project = { name: string; tag: string; desc: string };
export type Testimonial = { quote: string; name: string; role: string };
export type Social = { label: string; href: string; note: string };

/** Shape of the site content. */
export interface SiteCopy {
  brand: string;
  nav: { links: NavLink[] };
  hero: {
    badge: string;
    headline: HeadlineSegment[];
    tagline: string;
    intro: string;
    primaryCta: NavLink;
    secondaryCta: NavLink;
    stats: Stat[];
  };
  about: { kicker: string; statement: HeadlineSegment[] };
  services: { kicker: string; title: string; items: Service[] };
  experience: { kicker: string; title: string; jobs: Job[] };
  work: { kicker: string; title: string; projects: Project[] };
  philosophy: { quote: string; author: string };
  testimonials: { kicker: string; title: string; items: Testimonial[] };
  contact: {
    kicker: string;
    title: string;
    email: string;
    phone: string;
    socials: Social[];
  };
}

const EMAIL = "team@marketink.com";
const PHONE = "+1 (555) 012-3456";

const NAV_LINKS: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
// Big hero statement — two-ish words emphasized (rendered in the accent).
const HERO_HEADLINE: HeadlineSegment[] = [
  { text: "Designing with", emphasis: false },
  { text: "intent", emphasis: true },
  { text: "since 2015", emphasis: false },
];

export const content: SiteCopy = {
  brand: "Alex Quinn",
  nav: { links: NAV_LINKS },
  hero: {
    badge: "Available for new work",
    headline: HERO_HEADLINE,
    tagline: "Designing with intent since 2015",
    intro:
      "A product designer crafting high-quality, impactful digital experiences for teams who sweat the details.",
    primaryCta: { label: "Let’s talk", href: `mailto:${EMAIL}` },
    secondaryCta: { label: "See the work", href: "#work" },
    stats: [
      { value: 9, suffix: "+", label: "Years designing" },
      { value: 40, suffix: "+", label: "Projects shipped" },
      { value: 30, suffix: "+", label: "Happy clients" },
    ],
  },
  about: {
    kicker: "About me",
    statement: [
      { text: "A product designer with a strong focus on", emphasis: false },
      { text: "high-quality, impactful", emphasis: true },
      { text: "digital experiences for teams who sweat the details.", emphasis: false },
    ],
  },
  services: {
    kicker: "What I do",
    title: "Design that ships, not just slides",
    items: [
      {
        label: "Product",
        desc: "End-to-end product design — research, flows, and polished interfaces that actually ship.",
      },
      {
        label: "Visual",
        desc: "Cohesive visual systems and brand identities that stay consistent across every touchpoint.",
      },
      {
        label: "Motion",
        desc: "Interface motion and micro-interactions that make products feel considered and alive.",
      },
      {
        label: "Prototype",
        desc: "High-fidelity prototypes to test, iterate, and de-risk ideas before a line of code.",
      },
    ],
  },
  experience: {
    kicker: "Experience",
    title: "Over a decade shaping digital products",
    jobs: [
      { year: "NOW", role: "Design Lead", org: "Northwind Studio" },
      { year: "2021", role: "Senior Product Designer", org: "Orbit Labs" },
      { year: "2018", role: "Product Designer", org: "Fable & Co." },
      { year: "2015", role: "Junior Designer", org: "Pixel Forge" },
    ],
  },
  work: {
    kicker: "Selected work",
    title: "A few things I’m proud of",
    projects: [
      { name: "Helios", tag: "Fintech", desc: "Rebuilt onboarding for a fintech used by 1M+ people." },
      { name: "Vela", tag: "Health", desc: "Design system and mobile app for a wellness platform." },
      { name: "Northstar", tag: "SaaS", desc: "End-to-end dashboard for a B2B analytics product." },
      { name: "Cadence", tag: "Music", desc: "Brand and product for a collaborative music tool." },
      { name: "Terra", tag: "Climate", desc: "Data viz and marketing site for a climate startup." },
    ],
  },
  philosophy: { quote: "Good design is honest.", author: "Dieter Rams" },
  testimonials: {
    kicker: "What they said",
    title: "Kind words from good people",
    items: [
      {
        quote:
          "Alex is the rare designer who sweats the details and still ships on time.",
        name: "Jordan Lee",
        role: "Head of Product, Orbit Labs",
      },
      {
        quote: "The work elevated our entire brand. Thoughtful, fast, and precise.",
        name: "Sam Okafor",
        role: "Founder, Vela",
      },
      {
        quote: "Genuinely the best design partner we’ve worked with.",
        name: "Riya Nair",
        role: "PM, Northwind",
      },
    ],
  },
  contact: {
    kicker: "Contact",
    title: "Let’s build something",
    email: EMAIL,
    phone: PHONE,
    socials: [
      { label: "Dribbble", href: "https://dribbble.com/", note: "Selected shots" },
      { label: "YouTube", href: "https://youtube.com/", note: "Process & tips" },
      { label: "LinkedIn", href: "https://www.linkedin.com/", note: "The professional me" },
      { label: "Instagram", href: "https://www.instagram.com/", note: "Behind the scenes" },
    ],
  },
};
