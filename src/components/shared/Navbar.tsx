'use client'
import { useEffect, useRef, useState } from 'react'
import { Calendar, Phone, Mail, ChevronDown, X } from 'lucide-react'

const links = [
  { label: 'Servicios',  href: '#servicios' },
  { label: 'Proceso',    href: '#proceso' },
  { label: 'Resultados', href: '#casos' },
  { label: 'Contacto',   href: '#contacto' },
]

const BOOKING_URL = 'https://calendar.app.google/Xezqc3mQe6yi23k26'

// Interpolación lineal
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export default function Navbar() {
  const [p,            setP]            = useState(0)      // progress 0→1 (scrub escritorio)
  const [scrolled,     setScrolled]     = useState(false)  // estado isla (móvil, binario)
  const [hidden,       setHidden]       = useState(false)  // navbar oculto al bajar (web+móvil)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const lastY   = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      // Escritorio: scrub continuo 0-140px
      setP(Math.min(y / 140, 1))
      // Móvil: la isla aparece tras 120px (delay para que se aprecie la transición)
      setScrolled(y > 120)
      if (y < 60) setMenuOpen(false)

      // Ocultar al bajar / mostrar al subir — móvil un pelín antes (entra en
      // la parte oscura de la 2ª sección); escritorio a 1.2 viewports.
      const hideAfter = window.innerHeight * (window.innerWidth < 768 ? 1.0 : 1.2)
      if (y > hideAfter && y > lastY.current + 3) {
        setHidden(true)
        setMenuOpen(false)
        setDropdownOpen(false)
      } else if (y < lastY.current - 3) {
        setHidden(false)
      }
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // inicializar por si se carga a media página
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (!el) return
    const lenis = (window as unknown as Record<string, unknown>).__lenis as { scrollTo: (el: Element, opts: object) => void } | undefined
    if (lenis) lenis.scrollTo(el, { duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollTop = () => {
    const lenis = (window as unknown as Record<string, unknown>).__lenis as { scrollTo: (t: number, opts: object) => void } | undefined
    if (lenis) lenis.scrollTo(0, { duration: 1.2 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Valores interpolados (escritorio) ──
  const maxW      = lerp(1152, 340,  p)
  const padV      = lerp(24,   10,   p)
  const padTop    = lerp(0,    12,   p)
  const radius    = lerp(0,    18,   p)
  const bgAlpha   = lerp(0,    0.93, p)
  const blur      = lerp(0,    14,   p)
  const shadow    = p > 0.05 ? `0 4px 24px rgba(0,0,0,${(p * 0.09).toFixed(3)}), 0 0 0 1px rgba(0,0,0,${(p * 0.07).toFixed(3)})` : 'none'

  const linksOpacity = Math.max(0, Math.min(1, (0.65 - p) / 0.45))
  const linksScale   = lerp(1, 0.88, Math.min(1, p / 0.65))
  const burgerOpacity = Math.max(0, Math.min(1, (p - 0.4) / 0.45))

  const bar1Transform = menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none'
  const bar2Opacity   = menuOpen ? 0 : 1
  const bar3Transform = menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none'

  const islandShadow = '0 4px 24px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.06)'

  return (
    <>
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transform: hidden ? 'translateY(-120%)' : 'translateY(0)',
        transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* ── ESCRITORIO: scrub continuo (links se desvanecen, isla emerge) ── */}
      <div
        className="hidden md:flex mx-auto items-center justify-between px-6"
        style={{
          marginTop:      `${padTop}px`,
          maxWidth:       `${maxW}px`,
          paddingTop:     `${padV}px`,
          paddingBottom:  `${padV}px`,
          borderRadius:   `${radius}px`,
          background:     `rgba(250,250,247,${bgAlpha.toFixed(3)})`,
          backdropFilter: `blur(${blur.toFixed(1)}px)`,
          WebkitBackdropFilter: `blur(${blur.toFixed(1)}px)`,
          boxShadow:      shadow,
        }}
      >
        {/* Logo */}
        <a href="#" className="font-inter font-semibold text-[13px] tracking-[0.06em] uppercase text-[#1A1A1A] flex-shrink-0">
          ESENTIA AGENCY
        </a>

        {/* Zona central: links que se desvanecen + hamburger que emerge */}
        <div className="flex items-center justify-center" style={{ minWidth: 0 }}>
          <div
            className="flex items-center gap-8"
            style={{
              opacity:       linksOpacity,
              transform:     `scale(${linksScale})`,
              pointerEvents: linksOpacity < 0.1 ? 'none' : 'auto',
              transformOrigin: 'center',
              whiteSpace:    'nowrap',
            }}
          >
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={e => scrollTo(e, l.href)}
                className="hover-underline text-[13px] font-inter text-[#64748B] hover:text-[#1A1A1A] transition-colors duration-200">
                {l.label}
              </a>
            ))}
          </div>

          {/* Hamburger — emerge encima a medida que los links se van */}
          <div
            ref={menuRef}
            className="absolute flex items-center justify-center"
            style={{
              opacity:       burgerOpacity,
              pointerEvents: burgerOpacity < 0.15 ? 'none' : 'auto',
            }}
          >
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex flex-col gap-[5px] items-center justify-center w-8 h-8"
              aria-label="Menú"
            >
              <span style={{ display:'block', width:'18px', height:'1.5px', background:'#1A1A1A', transform: bar1Transform, transition:'transform 0.25s ease' }}/>
              <span style={{ display:'block', width:'18px', height:'1.5px', background:'#1A1A1A', opacity: bar2Opacity, transition:'opacity 0.2s ease' }}/>
              <span style={{ display:'block', width:'18px', height:'1.5px', background:'#1A1A1A', transform: bar3Transform, transition:'transform 0.25s ease' }}/>
            </button>

            {/* Dropdown menú */}
            <div
              className="absolute top-full mt-3 w-44 rounded-xl overflow-hidden border border-black/[0.07] bg-white shadow-xl shadow-black/10"
              style={{
                left:          '50%',
                opacity:       menuOpen ? 1 : 0,
                transform:     menuOpen ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(-6px) scale(0.97)',
                pointerEvents: menuOpen ? 'auto' : 'none',
                transition:    'opacity 0.2s ease, transform 0.2s ease',
              }}
            >
              {links.map((l, i) => (
                <a key={l.href} href={l.href} onClick={e => scrollTo(e, l.href)}
                  className={`flex items-center px-4 py-3 text-[13px] font-inter text-[#1A1A1A] hover:bg-[#F0F0E8] transition-colors ${
                    i !== links.length - 1 ? 'border-b border-black/[0.04]' : ''
                  }`}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Botón Contactar + dropdown */}
        <div ref={dropRef} className="inline-block relative flex-shrink-0">
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-inter font-medium text-white bg-[#0F766E] rounded-md hover:bg-[#0d6960] transition-colors"
          >
            Contactar
            <ChevronDown size={13} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}/>
          </button>

          <div
            className="absolute mt-2 w-56 rounded-xl overflow-hidden border border-black/[0.07] bg-white shadow-xl shadow-black/10"
            style={{
              left:          '50%',
              opacity:       dropdownOpen ? 1 : 0,
              transform:     dropdownOpen ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(-6px) scale(0.97)',
              pointerEvents: dropdownOpen ? 'auto' : 'none',
              transition:    'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 text-[13px] font-inter text-[#1A1A1A] hover:bg-[#F0F0E8] transition-colors">
              <Calendar size={14} className="text-[#0F766E] flex-shrink-0" />
              <div>
                <p className="font-medium leading-none mb-0.5">Consultoría gratuita</p>
                <p className="text-[11px] text-[#64748B]">30 min · sin compromiso</p>
              </div>
            </a>
            <div className="h-px bg-black/[0.05] mx-3" />
            <a href="tel:+34711237051" onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 text-[13px] font-inter text-[#1A1A1A] hover:bg-[#F0F0E8] transition-colors">
              <Phone size={14} className="text-[#0F766E] flex-shrink-0" />
              <div>
                <p className="font-medium leading-none mb-0.5">Llamar ahora</p>
                <p className="text-[11px] text-[#64748B]">+34 711 237 051</p>
              </div>
            </a>
            <div className="h-px bg-black/[0.05] mx-3" />
            <a href="mailto:victor.vallejo@esentiaagency.es" onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 text-[13px] font-inter text-[#1A1A1A] hover:bg-[#F0F0E8] transition-colors">
              <Mail size={14} className="text-[#0F766E] flex-shrink-0" />
              <div>
                <p className="font-medium leading-none mb-0.5">Enviar email</p>
                <p className="text-[11px] text-[#64748B]">victor.vallejo@esentiaagency.es</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ── MÓVIL: estado binario con transición CSS. Al hacer scroll las 3
          líneas se desvanecen y el logo queda centrado en la isla. Tocar el
          logo abre el menú. ── */}
      <div
        className="md:hidden mx-auto relative flex items-center"
        style={{
          marginTop:      scrolled ? '12px' : '0px',
          maxWidth:       scrolled ? '160px' : '100%',
          height:         scrolled ? '46px' : '62px',
          borderRadius:   scrolled ? '16px' : '0px',
          background:     scrolled ? 'rgba(250,250,247,0.97)' : 'rgba(250,250,247,0)',
          backdropFilter: scrolled ? 'blur(14px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'blur(0px)',
          boxShadow:      scrolled ? islandShadow : 'none',
          transition:     'max-width 0.55s cubic-bezier(0.4,0,0.2,1), height 0.45s ease, border-radius 0.45s ease, background 0.4s ease, box-shadow 0.4s ease, margin-top 0.45s ease',
        }}
      >
        {/* Logo: izquierda arriba → centro en isla. Tap abre menú al estar en isla. */}
        <button
          onClick={() => { if (scrolled) setMobileOpen(true); else scrollTop() }}
          aria-label={scrolled ? 'Abrir menú' : 'Inicio'}
          className="absolute font-inter font-semibold text-[13px] tracking-[0.06em] uppercase text-[#1A1A1A]"
          style={{
            top:        '50%',
            left:       scrolled ? '50%' : '24px',
            transform:  scrolled ? 'translate(-50%,-50%)' : 'translate(0,-50%)',
            transition: 'left 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)',
            whiteSpace: 'nowrap',
          }}
        >
          ESENTIA AGENCY
        </button>

        {/* 3 líneas: se desvanecen al entrar en isla */}
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Menú"
          className="absolute flex flex-col gap-1.5 p-1"
          style={{
            top:        '50%',
            right:      '24px',
            transform:  'translateY(-50%)',
            opacity:        scrolled ? 0 : 1,
            pointerEvents:  scrolled ? 'none' : 'auto',
            transition:     'opacity 0.35s ease',
          }}
        >
          <span className="w-5 h-px bg-[#1A1A1A] block"/>
          <span className="w-5 h-px bg-[#1A1A1A] block"/>
          <span className="w-3 h-px bg-[#1A1A1A] block"/>
        </button>
      </div>
    </nav>

    {/* ── MOBILE MENU OVERLAY ── */}
    <div
      className="md:hidden fixed inset-0 z-[100] bg-[#FAFAF7]"
      style={{
        opacity: mobileOpen ? 1 : 0,
        pointerEvents: mobileOpen ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
      }}
    >
      <div className="flex flex-col h-full px-6 pt-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <a href="#" className="font-inter font-semibold text-[13px] tracking-[0.06em] uppercase text-[#1A1A1A]">
            ESENTIA AGENCY
          </a>
          <button onClick={() => setMobileOpen(false)} className="p-1" aria-label="Cerrar">
            <X size={20} className="text-[#1A1A1A]" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1 flex-1">
          {links.map(l => (
            <a key={l.href} href={l.href}
              onClick={e => { setMobileOpen(false); scrollTo(e, l.href) }}
              className="text-[2rem] font-barlow font-bold uppercase tracking-tight text-[#1A1A1A] py-3 border-b border-black/[0.06] hover:text-[#0F766E] transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Contacto */}
        <div className="flex flex-col gap-3 mt-8">
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#0F766E] text-white text-[15px] font-inter font-medium rounded-xl">
            <Calendar size={16} /> Consultoría gratuita
          </a>
          <div className="flex gap-3">
            <a href="tel:+34711237051"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-black/10 rounded-xl text-[14px] font-inter text-[#1A1A1A]">
              <Phone size={15} /> Llamar
            </a>
            <a href="mailto:victor.vallejo@esentiaagency.es"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-black/10 rounded-xl text-[14px] font-inter text-[#1A1A1A]">
              <Mail size={15} /> Email
            </a>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}
