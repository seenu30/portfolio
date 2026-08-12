import { content } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Work() {
  const { work } = content;

  return (
    <section id="work" data-cursor="expand" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading kicker={work.kicker} title={work.title} />

        <div className="mt-14 border-t border-[var(--color-border)]">
          {work.projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.04}>
              <div
                data-cursor="view"
                className="group grid grid-cols-1 gap-2 border-b border-[var(--color-border)] py-7 transition-colors duration-300 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:rounded-2xl sm:px-4 sm:hover:bg-[var(--color-surface)]"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-sm tabular-nums text-[var(--color-muted)] transition-colors duration-300 sm:group-hover:text-[var(--color-bright)]">
                    0{i + 1}
                  </span>
                  <h3 className="display text-5xl font-bold uppercase text-[var(--color-foreground)] transition-[color,transform] duration-300 sm:text-7xl lg:text-[6rem] sm:group-hover:translate-x-2 sm:group-hover:text-[var(--color-bright)]">
                    {p.name}
                  </h3>
                </div>
                <p className="text-[var(--color-subtle)] transition-all duration-300 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:text-[var(--color-bright)] sm:group-hover:opacity-100">
                  {p.desc}
                </p>
                <span className="justify-self-start rounded-full border border-[var(--color-border-strong)] px-3 py-1 text-xs font-medium text-[var(--color-subtle)] transition-colors duration-300 sm:justify-self-end sm:group-hover:border-[var(--color-accent-2)] sm:group-hover:text-[var(--color-accent-2)]">
                  {p.tag}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
