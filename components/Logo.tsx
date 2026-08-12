/**
 * Brand mark — an original geometric "A" monogram. `fill-current` so it inherits
 * the link colour (tan → ember on hover). Swap this SVG for your real logo.
 */
export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${className} fill-current`}
    >
      <path d="M12 2 2 22h4.2l1.9-4.6h7.8L17.8 22H22L12 2Zm-2.4 11L12 7.2 14.4 13H9.6Z" />
    </svg>
  );
}
