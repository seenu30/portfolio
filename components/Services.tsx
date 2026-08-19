import {
  siFigma,
  siFramer,
  siWebflow,
  siSketch,
  siBlender,
  siNotion,
  siStorybook,
  siReact,
  siTailwindcss,
  siVercel,
} from "simple-icons";
import { content } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Marquee from "./Marquee";

// Tool logos for the marquee. Server component → simple-icons stays out of the
// client bundle; only the small SVG path strings are passed to <Marquee>.
const TOOLS = [
  { label: "Figma", path: siFigma.path, hex: siFigma.hex },
  { label: "Framer", path: siFramer.path, hex: siFramer.hex },
  { label: "Webflow", path: siWebflow.path, hex: siWebflow.hex },
  { label: "Sketch", path: siSketch.path, hex: siSketch.hex },
  { label: "Blender", path: siBlender.path, hex: siBlender.hex },
  { label: "Notion", path: siNotion.path, hex: siNotion.hex },
  { label: "Storybook", path: siStorybook.path, hex: siStorybook.hex },
  { label: "React", path: siReact.path, hex: siReact.hex },
  { label: "Tailwind", path: siTailwindcss.path, hex: siTailwindcss.hex },
  { label: "Vercel", path: siVercel.path, hex: siVercel.hex },
];

export default function Services() {
  const { services } = content;

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <SectionHeading kicker={services.kicker} title={services.title} />
      </div>

      {/* Full-bleed list: dividers span the page width; each row's content stays
          centred in the same max-w-2xl column as the heading. */}
      <div className="full-bleed mt-6 border-t border-[var(--color-border)]">
        {services.items.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.05}>
            <div className="group relative overflow-hidden border-b border-[var(--color-border)]">
              {/* Green panel that reveals from the centre line, filling up + down. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 origin-center scale-y-0 bg-[var(--color-accent-2)] transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100"
              />
              <div className="relative mx-auto grid max-w-2xl grid-cols-1 gap-2 px-5 py-7 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:px-8">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm tabular-nums text-[var(--color-muted)] transition-colors duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:group-hover:text-[var(--color-bright)]">
                    0{i + 1}
                  </span>
                  <h3 className="display text-4xl font-bold uppercase text-[var(--color-foreground)] transition-[color,transform] duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:text-6xl sm:group-hover:translate-x-2 sm:group-hover:text-[var(--color-bright)]">
                    {item.label}
                  </h3>
                </div>
                <p className="max-w-xs text-sm text-[var(--color-subtle)] transition-all duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] sm:translate-y-1 sm:justify-self-end sm:text-right sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:text-[var(--color-bright)] sm:group-hover:opacity-100">
                  {item.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="full-bleed mt-16 border-y border-[var(--color-border)] py-5">
        <Marquee items={TOOLS} duration={28} />
      </div>
    </section>
  );
}
