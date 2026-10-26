// Лого EMÖTE з підписом AGENCY — SVG з Figma (node 40002207:307), у своєму розмірі 120.55×48.
export default function Logo({ href = "/", className = "" }) {
  return (
    <a href={href} aria-label="EMOTE Agency — home" className={`block w-fit ${className}`}>
      <img src="brand/emote-logo-agency-white.svg" alt="EMOTE Agency" width="120.55" height="48.018" className="block" />
    </a>
  );
}
