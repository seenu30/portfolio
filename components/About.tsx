import { content } from "@/lib/content";
import Reveal from "./Reveal";

/**
 * "About me" block — a small kicker beside one oversized statement, with a
 * couple of words in the accent. Left-aligned, matching the section rhythm.
 */
export default function About() {
  const { about } = content;

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.5em] text-[var(--color-foreground)]">
            {about.kicker}
          </p>
          <p className="mt-6 text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            {about.statement.map((seg, i) => (
              <span
                key={i}
                className={
                  seg.emphasis
                    ? "text-[var(--color-accent-2)]"
                    : "text-[var(--color-foreground)]"
                }
              >
                {seg.text}
                {i < about.statement.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
