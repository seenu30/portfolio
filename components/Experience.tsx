"use client";

import { content } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Experience() {
  const { experience } = content;

  return (
    <section id="experience" data-cursor="expand" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading kicker={experience.kicker} title={experience.title} />

        <ol className="mt-14 border-l border-[var(--color-border-strong)] pl-6 sm:pl-10">
          {experience.jobs.map((job, i) => (
            <Reveal key={`${job.year}-${job.role}`} delay={i * 0.05}>
              <li
                data-cursor
                className="group relative grid grid-cols-1 gap-1 py-6 sm:grid-cols-[6rem_1fr] sm:items-baseline sm:gap-8"
              >
                {/* dot */}
                <span className="absolute -left-[calc(1.5rem+5px)] top-8 h-2.5 w-2.5 rounded-full bg-[var(--color-border-strong)] transition-colors duration-300 group-hover:bg-[var(--color-accent-2)] sm:-left-[calc(2.5rem+5px)]" />
                <span className="text-sm font-medium tabular-nums text-[var(--color-accent-2)]">
                  {job.year}
                </span>
                <div className="flex flex-wrap items-baseline gap-x-3 transition-transform duration-300 sm:group-hover:translate-x-2">
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)] transition-colors duration-300 group-hover:text-[var(--color-accent-2)] sm:text-2xl">
                    {job.role}
                  </h3>
                  <span className="text-[var(--color-muted)]">— {job.org}</span>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
