import type { AnchorHTMLAttributes, ReactNode } from "react";

// Schemes we allow to be rendered as links. Anything else (javascript:, data:, …)
// is refused and rendered as inert text — defence against a bad paste in content.ts.
const ALLOWED_SCHEMES = new Set(["https:", "mailto:", "tel:"]);
// In-page anchors and root-relative paths are always safe.
const isInternal = (href: string) => href.startsWith("#") || href.startsWith("/");

function schemeOf(href: string): string | null {
  try {
    // mailto:/tel: are opaque; give URL a base so relative values don't throw.
    return new URL(href, "https://placeholder.local").protocol;
  } catch {
    return null;
  }
}

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

/**
 * Safe anchor. Internal links render plainly; external links get
 * rel="noopener noreferrer" + target="_blank" and are validated against a
 * scheme allowlist. Disallowed schemes never become clickable.
 */
export default function ExternalLink({ href, children, ...rest }: Props) {
  if (isInternal(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  const scheme = schemeOf(href);
  if (!scheme || !ALLOWED_SCHEMES.has(scheme)) {
    // Refuse to emit a link for an unexpected/unsafe scheme.
    return <span {...(rest as Record<string, unknown>)}>{children}</span>;
  }

  const isHttp = scheme === "https:";
  return (
    <a
      href={href}
      // Only http(s) links open a new tab; mailto/tel open the handler in place.
      target={isHttp ? "_blank" : undefined}
      rel={isHttp ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
