import { SVGProps } from 'react'

interface LogoProps extends SVGProps<SVGSVGElement> {
  className?: string
  iconOnly?: boolean
}

export default function Logo({ className = '', iconOnly = false, ...props }: LogoProps) {
  return (
    <svg
      viewBox={iconOnly ? '0 0 60 52' : '0 0 220 52'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Esentia Agency"
      role="img"
      {...props}
    >
      {/* Hexagon icon */}
      <g>
        {/* Outer hexagon */}
        <path
          d="M15 2.5L45 2.5L60 28L45 53.5L15 53.5L0 28L15 2.5Z"
          fill="currentColor"
          transform="scale(0.9) translate(3, 1)"
        />
        {/* Inner E cutout - white/bg color */}
        <path
          d="M18 18H36V23H23.5V25.5H34V30.5H23.5V33H36V38H18V18Z"
          fill="var(--bg, #0A0A0A)"
        />
      </g>

      {/* Wordmark — only shown when not iconOnly */}
      {!iconOnly && (
        <g transform="translate(68, 11)">
          <text
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="700"
            fontSize="22"
            letterSpacing="0.05em"
            fill="currentColor"
          >
            ESENTIA
          </text>
          <text
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="400"
            fontSize="11"
            letterSpacing="0.15em"
            fill="currentColor"
            opacity="0.6"
            y="20"
          >
            AGENCY
          </text>
        </g>
      )}
    </svg>
  )
}
