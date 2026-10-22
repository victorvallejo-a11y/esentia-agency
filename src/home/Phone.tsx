import type { CSSProperties, ReactNode } from 'react'

/* iPhone 16 Pro hecho en CSS. Todas las medidas van en em, así que el tamaño
   se controla solo con font-size (1em = 10px a 620px de alto).
   Con `depth` lleva canto de titanio por capas, botones y trasera: se puede
   girar en 3D sin que se vea plano. */

export function StatusIcons() {
  return (
    <span className="ph-ico" aria-hidden="true">
      <svg viewBox="0 0 18 12" className="i-sig">
        <rect x="0" y="8" width="3" height="4" rx=".8" />
        <rect x="5" y="5.5" width="3" height="6.5" rx=".8" />
        <rect x="10" y="3" width="3" height="9" rx=".8" />
        <rect x="15" y="0" width="3" height="12" rx=".8" />
      </svg>
      <svg viewBox="0 0 16 12" className="i-wifi">
        <path d="M8 11.6 10.4 9a3.4 3.4 0 0 0-4.8 0z" />
        <path d="M3.3 6.6a6.6 6.6 0 0 1 9.4 0l-1.5 1.6a4.5 4.5 0 0 0-6.4 0z" />
        <path d="M.6 3.8a10.4 10.4 0 0 1 14.8 0l-1.5 1.6a8.3 8.3 0 0 0-11.8 0z" />
      </svg>
      <svg viewBox="0 0 28 13" className="i-bat">
        <rect x=".6" y=".6" width="23.4" height="11.8" rx="3.6" fill="none" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.1" />
        <rect x="2.4" y="2.4" width="17.6" height="8.2" rx="2" />
        <path d="M25.6 4.6c.9.3 1.5 1 1.5 1.9s-.6 1.6-1.5 1.9z" opacity=".45" />
      </svg>
    </span>
  )
}

type Props = {
  children: ReactNode
  time?: string
  depth?: boolean
  layers?: number
  tone?: 'black' | 'natural'
  className?: string
  style?: CSSProperties
}

export default function Phone({ children, time = '9:41', depth = false, layers = 18, tone = 'black', className = '', style }: Props) {
  return (
    <div className={`ph ph-${tone}${depth ? ' ph-3d' : ''} ${className}`} style={style}>
      {depth && (
        <>
          {Array.from({ length: layers }).map((_, i) => {
            const k = i / (layers - 1)
            // Brillo del canto: más luz en el centro, más sombra hacia los bordes.
            const h = Math.round(Math.pow(1 - Math.abs(k - 0.5) * 2, 0.7) * 100)
            const mid = k > 0.3 && k < 0.7
            return <i key={i} className={`ph-l${mid ? ' mid' : ''}`} style={{ ['--k' as string]: k, ['--h' as string]: `${h}%` }} />
          })}
          <div className="ph-back">
            <div className="ph-cam">
              <i className="lens l1" />
              <i className="lens l2" />
              <i className="lens l3" />
              <i className="flash" />
              <i className="lidar" />
            </div>
          </div>
        </>
      )}
      <div className="ph-front">
        <div className="ph-scr">
          <div className="ph-sb">
            <span className="ph-time">{time}</span>
            <StatusIcons />
          </div>
          {children}
          <i className="ph-home" />
        </div>
        <i className="ph-island" />
        <i className="ph-glare" />
      </div>
    </div>
  )
}

/* ── Piezas de WhatsApp para iOS ─────────────────────────────────────── */

export function Ticks() {
  return (
    <svg viewBox="0 0 16 11" className="wt-ck" aria-hidden="true">
      <path d="M1 5.8 4 8.8 10.2 2.2M6.6 8.4l.6.5 6.2-6.7" />
    </svg>
  )
}

export function WaNav({ name, sub, avatar }: { name: string; sub: ReactNode; avatar: ReactNode }) {
  return (
    <div className="wa-nav">
      <svg viewBox="0 0 12 20" className="wa-back" aria-hidden="true">
        <path d="M10 2 2 10l8 8" />
      </svg>
      <span className="wa-av">{avatar}</span>
      <span className="wa-who">
        <b>{name}</b>
        <small>{sub}</small>
      </span>
      <svg viewBox="0 0 26 18" className="wa-vid" aria-hidden="true">
        <rect x="1" y="2" width="16" height="14" rx="3.5" />
        <path d="M17 7.4 24 3.6v10.8L17 10.6z" />
      </svg>
      <svg viewBox="0 0 22 22" className="wa-tel" aria-hidden="true">
        <path d="M5.6 1.8 8.4 1.2l2 4.6-2.4 1.8a12 12 0 0 0 6.4 6.4l1.8-2.4 4.6 2-.6 2.8c-.3 1.2-1.4 2-2.6 1.9C9.2 17.6 4.4 12.8 3.7 4.4c-.1-1.2.7-2.3 1.9-2.6z" />
      </svg>
    </div>
  )
}

export function WaInput() {
  return (
    <div className="wa-in" aria-hidden="true">
      <svg viewBox="0 0 20 20"><path d="M10 3v14M3 10h14" /></svg>
      <span className="wa-field">
        <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" /><path d="M6.8 11.6c.8 1.2 1.9 1.8 3.2 1.8s2.4-.6 3.2-1.8M7.5 8h.01M12.5 8h.01" /></svg>
      </span>
      <svg viewBox="0 0 24 20"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h2.2l1.6-2.2h7.4L17.3 4h2.2A2.5 2.5 0 0 1 22 6.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 15.5z" /><circle cx="12" cy="10.8" r="3.8" /></svg>
      <svg viewBox="0 0 16 22"><rect x="4" y="1.5" width="8" height="12.5" rx="4" /><path d="M1.5 10.5a6.5 6.5 0 0 0 13 0M8 17v3.5" /></svg>
    </div>
  )
}
