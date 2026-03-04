/**
 * Custom SVG brand icons for the landing page.
 * Platform logos based on Simple Icons (CC0 1.0 Universal / Public Domain).
 * Flowfolio logo is original.
 */

interface IconProps {
  size?: number;
  className?: string;
}

/** Windows 11 logo — 4-pane grid */
export function WindowsIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z" />
    </svg>
  );
}

/** Apple logo */
export function AppleIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

/** Linux (Tux) logo */
export function LinuxIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.345 1.884 1.345.358 0 .705-.127 1.001-.361.07.071.145.134.221.194.293.242.611.383.937.383.258 0 .517-.085.764-.263.248-.18.437-.453.52-.765.004-.007.008-.021.011-.029.32-.334.59-.853.59-1.525 0-.209-.033-.421-.075-.609-.058-.262-.137-.51-.234-.723.012-.109.02-.219.02-.329 0-.249-.06-.514-.168-.756a2.34 2.34 0 00-.344-.538c-.174-.191-.396-.339-.643-.437a1.78 1.78 0 00-.418-.133 2.32 2.32 0 00-.725.012 1.7 1.7 0 00-.452.118c-.146.068-.283.149-.404.248-.213.179-.387.404-.502.66a2.4 2.4 0 00-.08.183c-.107.285-.135.579-.091.862-.004.086-.004.172 0 .258a1.98 1.98 0 00-.123-.037c-.287-.074-.607-.052-.913.054-.086.03-.17.067-.248.112a1.46 1.46 0 00-.447.385 1.54 1.54 0 00-.242.46 2.09 2.09 0 00-.098.471l-.013.194c-.025.107-.056.21-.093.31a7.53 7.53 0 01-2.197-.001c-.085-.115-.165-.243-.234-.381a1.88 1.88 0 01-.13-.353 1.9 1.9 0 01-.058-.408c-.004-.12.004-.24.023-.358a2.3 2.3 0 00-.066-.63 1.62 1.62 0 00-.26-.475 1.3 1.3 0 00-.397-.326 1.3 1.3 0 00-.478-.154c-.18-.028-.363-.016-.539.024-.073.016-.146.04-.216.068l-.007.001c.013-.094.022-.188.026-.282a2.2 2.2 0 00-.093-.89 1.83 1.83 0 00-.5-.67 1.73 1.73 0 00-.406-.257 1.7 1.7 0 00-.45-.133 2.1 2.1 0 00-.725.012c-.146.03-.29.076-.418.133-.247.098-.47.246-.643.437a2.34 2.34 0 00-.344.538c-.108.242-.168.507-.168.756 0 .11.008.221.02.33a3.49 3.49 0 00-.234.722c-.042.188-.075.4-.075.61 0 .671.27 1.19.59 1.524l.011.03c.083.311.272.584.52.764.247.178.506.263.764.263.326 0 .644-.141.937-.383a2.8 2.8 0 00.221-.194c.296.234.643.361 1.001.361.77 0 1.493-.567 1.884-1.345l.003-.003c.051-.135.089-.199.114-.333 1.003.067 1.878-.258 2.577-.2 1.03.065 1.673.331 2.26.334.238.482.682.83 1.208.946.75.2 1.69-.004 2.616-.47.863-.465 1.964-.4 2.774-.6.405-.131.766-.267.94-.601.174-.339.143-.804-.106-1.484-.076-.242-.018-.571.04-.97.028-.136.055-.337.055-.536.004-.208-.042-.413-.132-.602-.206-.411-.551-.544-.864-.68-.312-.133-.598-.201-.797-.4a3.85 3.85 0 01-.663-.839.424.424 0 00-.11-.135c.123-.805-.009-1.657-.287-2.489-.589-1.77-1.831-3.47-2.716-4.521-.75-1.067-.974-1.928-1.05-3.02-.065-1.491 1.056-5.965-3.17-6.298A5.11 5.11 0 0012.504 0" />
    </svg>
  );
}

/** GitHub logo (Octocat mark) */
export function GitHubIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

/** Flowfolio brand mark — stylized "F" with flow lines */
export function FlowfolioLogo({ size = 28, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={className}
    >
      {/* Outer rounded square */}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="7"
        fill="url(#flowfolio-grad)"
      />
      {/* Flow lines forming abstract "F" */}
      <path
        d="M10 10h12M10 16h8M10 10v12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Accent dot -- the "flow" */}
      <circle cx="21" cy="22" r="2" fill="white" opacity="0.8" />
      <defs>
        <linearGradient
          id="flowfolio-grad"
          x1="2"
          y1="2"
          x2="30"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Decorative grid pattern for hero background */
export function HeroGridPattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <pattern
          id="hero-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(148, 163, 184, 0.06)"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id="hero-grid-fade" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id="hero-grid-mask">
          <rect width="100%" height="100%" fill="url(#hero-grid-fade)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#hero-grid)"
        mask="url(#hero-grid-mask)"
      />
    </svg>
  );
}

/** Glowing orb for hero background accent */
export function HeroGlowOrb({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -60%)",
        pointerEvents: "none",
      }}
    />
  );
}
