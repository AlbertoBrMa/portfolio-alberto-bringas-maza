type LogoProps = {
  accent?: string;
  foreground?: string;
  size?: number;
  className?: string;
};

export default function Logo({
  accent = '#3B82F6',
  foreground = '#FFFFFF',
  size = 220,
  className,
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size * 0.32}
      viewBox="0 0 420 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label=".ABM logo"
    >
      {/* Punto circular */}
      <circle id="dot" cx="24" cy="60" r="12" fill={accent} />

      {/* A geométrica */}
      <path
        id="letterA"
        d="M72 98 L108 22 L144 98 L126 98 L116 74 L100 74 L90 98 Z"
        fill={accent}
      />

      {/* </> dentro de la A — color oscuro para contrastar con el azul de la A */}
      <path
        id="code"
        d="M96 58 L88 50 L96 42 M120 42 L128 50 L120 58 M112 36 L104 64"
        stroke="#080810"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* B blanca */}
      <path
        id="letterB"
        d="M176 22 H212 C232 22 244 34 244 50 C244 62 236 70 224 72 C238 74 248 84 248 98 C248 116 234 120 214 120 H176 V22 Z
           M194 38 V64 H210 C220 64 226 58 226 50 C226 42 220 38 210 38 H194 Z
           M194 78 V104 H214 C226 104 232 98 232 90 C232 82 226 78 214 78 H194 Z"
        fill={foreground}
      />

      {/* M geométrica */}
      <path
        id="letterM"
        d="M286 98 V22 L318 58 L350 22 V98 H332 V52 L318 68 L304 52 V98 Z"
        fill={accent}
      />
    </svg>
  );
}
