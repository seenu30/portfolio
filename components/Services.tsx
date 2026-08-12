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
    <section id="services" data-cursor="expand" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading kicker={services.kicker} title={services.title} />

        <div className="mt-14 border-t border-[var(--color-border)]">
          {services.items.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <div
                data-cursor
                className="group grid grid-cols-1 gap-3 border-b border-[var(--color-border)] py-8 transition-colors duration-300 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline sm:gap-8 sm:rounded-2xl sm:px-4 sm:hover:bg-[var(--color-surface)]"
              >
                <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)] transition-[color,transform] duration-300 sm:group-hover:translate-x-2 sm:group-hover:text-[var(--color-bright)]">
                  {item.label}
                </h3>
                <p className="max-w-xl text-[var(--color-subtle)] transition-colors duration-300 sm:group-hover:text-[var(--color-bright)]">
                  {item.desc}
                </p>
                <span className="hidden text-sm tabular-nums text-[var(--color-muted)] transition-colors duration-300 sm:block sm:group-hover:text-[var(--color-accent-2)]">
                  0{i + 1}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-16 border-y border-[var(--color-border)] py-5">
        <Marquee items={TOOLS} duration={28} />
      </div>
    </section>
  );
}
