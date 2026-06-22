export function NoiseOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      {/* Soft brand-blue glow at the top of the hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(43, 127, 255, 0.07) 0%, transparent 60%)',
        }}
      />
      {/* Faint paper grain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '182px',
          opacity: 0.04,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
}
