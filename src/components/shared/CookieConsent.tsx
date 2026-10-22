'use client'
import { useEffect, useRef, useState } from 'react'
import './cookies.css'

const KEY = 'es-consent'

type Gtag = (...a: unknown[]) => void
type Lenis = { stop: () => void; start: () => void }

function read(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** Ventana de cookies al entrar. Analítica apagada (Consent Mode v2) hasta que se acepte;
    rechazar cuesta lo mismo que aceptar, y se puede reabrir desde el pie. */
export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [cfg, setCfg] = useState(false)
  const [an, setAn] = useState(false)
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined
    if (!read()) t = setTimeout(() => setOpen(true), 650)
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-open-consent]')) return
      setAn(read() === 'granted')
      setCfg(true)
      setOpen(true)
    }
    document.addEventListener('click', onClick)
    return () => {
      if (t) clearTimeout(t)
      document.removeEventListener('click', onClick)
    }
  }, [])

  // Mientras está abierta: sin scroll detrás y el foco dentro de la ventana.
  useEffect(() => {
    if (!open) return
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
    lenis?.stop()
    document.documentElement.classList.add('ck-open')
    const prev = document.activeElement as HTMLElement | null
    const first = card.current?.querySelector<HTMLElement>('.ckm-b button:last-child')
    const f = setTimeout(() => first?.focus({ preventScroll: true }), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !card.current) return
      const items = Array.from(card.current.querySelectorAll<HTMLElement>('button, a[href]')).filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const a = items[0], z = items[items.length - 1]
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault()
        z.focus()
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault()
        a.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(f)
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('ck-open')
      lenis?.start()
      prev?.focus?.({ preventScroll: true })
    }
  }, [open])

  const save = (granted: boolean) => {
    try {
      localStorage.setItem(KEY, granted ? 'granted' : 'denied')
    } catch {}
    const gtag = (window as unknown as { gtag?: Gtag }).gtag
    gtag?.('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' })
    setOpen(false)
    setTimeout(() => setCfg(false), 400)
  }

  return (
    <div className={`ckm${open ? ' on' : ''}`} aria-hidden={!open}>
      <div className="ckm-bg" />
      <div className="ckm-card" role="dialog" aria-modal="true" aria-labelledby="ck-t" aria-describedby="ck-d" ref={card}>
        <span className="ckm-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M20.5 12.6A8.5 8.5 0 1 1 11.4 3.5a3 3 0 0 0 3.7 3.6 3 3 0 0 0 3.6 3.7 3 3 0 0 0 1.8 1.8z" />
            <circle cx="8.6" cy="10" r="1" />
            <circle cx="13.6" cy="14.6" r="1" />
            <circle cx="8.8" cy="15.4" r="1" />
          </svg>
        </span>
        <h2 id="ck-t">Antes de seguir</h2>
        <p id="ck-d">
          Usamos cookies de analítica para saber qué partes de la web sirven y cuáles no. Sin publicidad y sin vender tus datos.
        </p>

        <div className={`ckm-cfg${cfg ? ' on' : ''}`}>
          <div>
            <div className="ckm-row">
              <span>
                <b>Necesarias</b>
                <small>Para que la web funcione. Siempre activas.</small>
              </span>
              <span className="ckm-tg on lock" aria-hidden="true"><i /></span>
            </div>
            <div className="ckm-row">
              <span>
                <b>Analítica</b>
                <small>Google Analytics: visitas y secciones, de forma agregada.</small>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={an}
                aria-label="Cookies de analítica"
                className={`ckm-tg${an ? ' on' : ''}`}
                onClick={() => setAn((v) => !v)}
                tabIndex={open && cfg ? 0 : -1}
              >
                <i />
              </button>
            </div>
          </div>
        </div>

        <div className="ckm-b">
          {cfg ? (
            <>
              <button type="button" className="g" onClick={() => save(an)} tabIndex={open ? 0 : -1}>
                Guardar selección
              </button>
              <button type="button" className="p" onClick={() => save(true)} tabIndex={open ? 0 : -1}>
                Aceptar todas
              </button>
            </>
          ) : (
            <>
              <button type="button" className="g" onClick={() => save(false)} tabIndex={open ? 0 : -1}>
                Rechazar
              </button>
              <button type="button" className="p" onClick={() => save(true)} tabIndex={open ? 0 : -1}>
                Aceptar
              </button>
            </>
          )}
        </div>
        <div className="ckm-f">
          <button type="button" onClick={() => setCfg((v) => !v)} aria-expanded={cfg} tabIndex={open ? 0 : -1}>
            {cfg ? 'Menos opciones' : 'Configurar'}
          </button>
          <a href="/cookies" tabIndex={open ? 0 : -1}>Política de cookies</a>
        </div>
      </div>
    </div>
  )
}
