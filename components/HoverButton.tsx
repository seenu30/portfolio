import ExternalLink from "./ExternalLink";

type Variant = "primary" | "ghost" | "outline";

type Props = {
  href: string;
  label: string;
  variant?: Variant;
  className?: string;
};

const base =
  "group relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium " +
  "transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-[var(--color-foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white hover:bg-[color-mix(in_oklab,var(--color-accent),white_14%)]",
  outline:
    "border border-[var(--color-border-strong)] text-[var(--color-foreground)] hover:border-[var(--color-foreground)]",
  ghost:
    "text-[var(--color-foreground)] hover:text-[var(--color-subtle)]",
};

/**
 * Pill CTA with a label-swap hover: the label slides up while an identical copy
 * rises from below. Pure CSS (group-hover) — no client JS. The visible label is
 * the accessible name; the incoming copy is aria-hidden so the name never flickers.
 */
export default function HoverButton({
  href,
  label,
  variant = "primary",
  className = "",
}: Props) {
  return (
    <ExternalLink href={href} className={`${base} ${variants[variant]} ${className}`}>
      <span className="relative block h-[1.25em] overflow-hidden">
        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
        >
          {label}
        </span>
      </span>
    </ExternalLink>
  );
}
