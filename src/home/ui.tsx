import type { ReactNode, AnchorHTMLAttributes } from 'react'

export const WA_URL = 'https://wa.me/34711237051'
export const MAIL = 'victor.vallejo@esentiaagency.es'

/** Número con punto de miles siempre (3.284, no 3284). */
export const fmtN = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 19.5l1.2-3.6A7.6 7.6 0 1 1 8.6 18.5z" />
      <path d="M9.2 9.1c.2 1.9 1.8 3.6 3.7 4.2l1-1 1.6.7-.3 1.4c-2.9.3-6.4-2.8-6.5-5.9l1.4-.4.7 1.6z" />
    </svg>
  )
}

type BtnProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'ghost' | 'light'
  icon?: 'arrow' | 'wa'
  children: ReactNode
}

/** Botón píldora con el icono en su propio círculo. */
export function Btn({ variant = 'primary', icon = 'arrow', className = '', children, ...rest }: BtnProps) {
  return (
    <a className={`eb eb-${variant} ${className}`} data-magnet {...rest}>
      <span className="eb-t">{children}</span>
      <span className="eb-i" aria-hidden="true">{icon === 'wa' ? <WaIcon /> : <Arrow />}</span>
    </a>
  )
}

export function Logo() {
  return (
    <span className="logo">
      <b>ESENTIA</b>
      <small>AGENCY</small>
    </span>
  )
}
