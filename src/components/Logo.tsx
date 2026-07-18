export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 440 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle id="dot" cx="28" cy="196" r="13" fill="#3B82F6" />

      <path
        id="letterA"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#3B82F6"
        d="M135,15 L215,205 L55,205 Z M135,80 L170,175 L100,175 Z"
      />

      <path
        id="code"
        fill="#3B82F6"
        d="
          M129,151 L119,162 L129,173 L132,170 L124,162 L132,154 Z
          M135,173 L140,151 L143,152 L138,174 Z
          M161,151 L171,162 L161,173 L158,170 L166,162 L158,154 Z
        "
      />

      <path
        id="letterB"
        fill="#FFFFFF"
        d="
          M225,15 L251,15 L251,205 L225,205 Z
          M251,15 L285,15 C312,15 328,32 328,58 C328,84 312,104 285,104 L251,104 Z
          M251,116 L290,116 C318,116 335,136 335,162 C335,188 316,205 288,205 L251,205 Z
        "
      />

      <path
        id="letterM"
        fill="#3B82F6"
        d="M345,205 L345,15 L392,115 L440,15 L440,205 L415,205 L415,65 L392,155 L370,65 L370,205 Z"
      />
    </svg>
  )
}
