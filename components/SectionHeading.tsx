import Reveal from "./Reveal";

/** Kicker + big display title used at the top of each section. */
export default function SectionHeading({
  kicker,
  title,
  className = "",
}: {
  kicker: string;
  title: string;
  className?: string;
}) {
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-accent-2)]">
        {kicker}
      </p>
      <h2 className="display mt-4 text-4xl font-semibold sm:text-5xl lg:text-6xl">
        {title}
      </h2>
    </Reveal>
  );
}
