'use client'
import { useEffect, useState } from 'react'
import { Btn, Logo } from './ui'

const LINKS = [
  { href: '#que', label: 'Qué hacemos' },
  { href: '#ejemplos', label: 'Ejemplos' },
  { href: '#caso', label: 'Caso real' },
  { href: '#como', label: 'Cómo trabajamos' },
]

/** Lleva a una ancla usando Lenis si está activo (scroll suave coherente con GSAP). */
export function goTo(hash: string) {
  const el = document.querySelector(hash) as HTMLElement | null
  if (!el) return
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis
  if (lenis) lenis.scrollTo(el, { offset: -12, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [fab, setFab] = useState(false)

  useEffect(() => {
    // Botón flotante de reserva en móvil: aparece al dejar atrás el hero y se
    // esconde cuando ya se ve la agenda o el pie (no tapa lo que ya invita a reservar)
    // y durante las escenas fijadas, para no tapar lo que pasa abajo de la pantalla.
    const hidden = new Set<Element>()
    const track = (e: IntersectionObserverEntry) => (e.isIntersecting ? hidden.add(e.target) : hidden.delete(e.target))
    const io = new IntersectionObserver((en) => { en.forEach(track); onScroll() }, { rootMargin: '0px 0px -10% 0px' })
    const scenes = new IntersectionObserver((en) => { en.forEach(track); onScroll() }, { rootMargin: '-45% 0px -45% 0px' })
    ;['#agenda', '.foot'].forEach((s) => {
      const el = document.querySelector(s)
      if (el) io.observe(el)
    })
    ;['.dato', '.sys', '.case-stage', '.how'].forEach((s) => {
      const el = document.querySelector(s)
      if (el) scenes.observe(el)
    })
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const hero = document.getElementById('inicio')
      setFab(!!hero && window.scrollY > hero.offsetHeight * 0.7 && hidden.size === 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Todas las anclas internas de la home pasan por el mismo scroll suave.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const hash = a.getAttribute('href')!
      if (hash.length < 2) return
      e.preventDefault()
      setOpen(false)
      goTo(hash)
      history.replaceState(null, '', hash)
    }
    document.addEventListener('click', onClick)
    return () => {
      io.disconnect()
      scenes.disconnect()
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis
    if (open) lenis?.stop()
    else lenis?.start()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="nav-in">
          <a href="#inicio" aria-label="Esentia Agency, inicio" className="nav-logo">
            <Logo />
          </a>
          <nav className="nav-links" aria-label="Secciones">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav-r">
            <Btn href="#agenda" className="nav-cta">
              Diagnóstico gratis
            </Btn>
            <button
              type="button"
              className={`burger${open ? ' x' : ''}`}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((v) => !v)}
            >
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>

      <div className={`menu${open ? ' open' : ''}`} id="menu" aria-hidden={!open}>
        <nav aria-label="Menú">
          {LINKS.map((l, i) => (
            <a key={l.href} href={l.href} style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }} tabIndex={open ? 0 : -1}>
              <small>0{i + 1}</small>
              {l.label}
            </a>
          ))}
          <a href="#agenda" className="menu-cta" style={{ transitionDelay: open ? '300ms' : '0ms' }} tabIndex={open ? 0 : -1}>
            Reserva tu diagnóstico gratis
          </a>
        </nav>
      </div>

      <Btn href="#agenda" className={`fab${fab && !open ? ' on' : ''}`} tabIndex={fab ? 0 : -1} aria-hidden={!fab}>
        Diagnóstico gratis · 30 min
      </Btn>
    </>
  )
}
