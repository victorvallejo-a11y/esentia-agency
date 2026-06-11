'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Users, Headphones, Megaphone, Cog, FileText } from 'lucide-react'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const departments = [
  {
    name: 'Ventas',
    Icon: Users,
    bg: '#05111f',
    text: '#ffffff',
    accent: '#2DD4BF',
    // Glow desde la esquina superior-derecha (móvil y escritorio).
    glow: 'radial-gradient(ellipse 85% 80% at 92% 4%, #2DD4BF55 0%, transparent 68%)',
    tagline: 'Tu equipo solo habla con quien ya quiere comprar',
    bullets: [
      'Nunca más pierdas tiempo con un lead que no va a cerrar',
      'El seguimiento ocurre solo, sin que nadie lo haga',
      'Una propuesta lista antes de que el cliente enfríe',
      'Sabes cuándo llamar antes de que se vaya a la competencia',
    ],
    metricLabel: 'más ventas cerradas',
    bigNum: '2.4×',
  },
  {
    name: 'Atención al cliente',
    Icon: Headphones,
    bg: '#0F766E',
    text: '#ffffff',
    accent: '#ccfbf1',
    glow: 'radial-gradient(ellipse 85% 80% at 92% 4%, #ccfbf155 0%, transparent 68%)',
    tagline: 'Respondes a las 3am sin estar despierto',
    bullets: [
      'Cero llamadas perdidas, cero clientes esperando',
      'Las preguntas de siempre se responden solas',
      'El cliente siente atención inmediata, siempre',
      'Un humano entra solo cuando de verdad hace falta',
    ],
    metricLabel: 'tiempo de respuesta',
    bigNum: '−80%',
  },
  {
    name: 'Marketing',
    Icon: Megaphone,
    bg: '#160f00',
    text: '#ffffff',
    accent: '#f59e0b',
    glow: 'radial-gradient(ellipse 85% 80% at 92% 4%, #f59e0b52 0%, transparent 68%)',
    tagline: 'Tu marca activa aunque no estés mirando',
    bullets: [
      'Cada lead recibe atención personalizada, sola',
      'Llegas al cliente correcto en el momento correcto',
      'Sabes qué funciona sin abrir una hoja de cálculo',
      'Campañas que se ajustan solas según resultados',
    ],
    metricLabel: 'leads cualificados',
    bigNum: '+65%',
  },
  {
    name: 'Operaciones',
    Icon: Cog,
    bg: '#D8D4CB',
    text: '#111111',
    accent: '#0F766E',
    glow: 'radial-gradient(ellipse 85% 80% at 92% 4%, #0F766E55 0%, transparent 68%)',
    tagline: 'Tus herramientas hablan entre sí, tú no haces nada',
    bullets: [
      'El lunes tienes el informe de la semana esperándote',
      'Los pedidos se gestionan solos de principio a fin',
      'Todo conectado: CRM, facturación, stock, email',
      'Las tareas repetitivas simplemente desaparecen',
    ],
    metricLabel: 'semanales recuperadas',
    bigNum: '12h',
  },
  {
    name: 'Administración',
    Icon: FileText,
    bg: '#0f0a1a',
    text: '#ffffff',
    accent: '#a78bfa',
    glow: 'radial-gradient(ellipse 85% 80% at 92% 4%, #a78bfa52 0%, transparent 68%)',
    tagline: 'Sin papeleos, sin retrasos, sin errores',
    bullets: [
      'Las facturas se envían solas cuando toca',
      'Tu agenda se gestiona sin llamadas de ida y vuelta',
      'Los clientes reciben recordatorios automáticos',
      'Documentos generados en segundos, no en horas',
    ],
    metricLabel: 'carga administrativa',
    bigNum: '−70%',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const panelsRef  = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none none' } }
      )
      gsap.fromTo(panelsRef.current?.querySelectorAll('.dept-panel') ?? [],
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: panelsRef.current, start: 'top 78%', toggleActions: 'play none none none' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const EASE = '0.58s cubic-bezier(0.4,0,0.2,1)'

  return (
    <section ref={sectionRef} id="servicios" className="bg-[#F0F0E8] py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">

        <div ref={headerRef} className="mb-12">
          <p className="text-[11px] font-inter uppercase tracking-[0.18em] text-[#0F766E] mb-3">Áreas de impacto</p>
          <h2 className="text-[clamp(2.3rem,4vw,2.8rem)] font-inter font-semibold leading-tight tracking-[-0.02em] text-[#111111]">
            IA que trabaja en cada{' '}
            <span className="text-[#0F766E]">rincón de tu negocio</span>
          </h2>
        </div>

        {/* ── MOBILE: cards verticales con animación ── */}
        <div className="md:hidden flex flex-col gap-3">
          {departments.map((dept, i) => {
            const { Icon } = dept
            const isOpen = hovered === i
            return (
              <div key={i} className="rounded-xl overflow-hidden cursor-pointer relative"
                style={{
                  backgroundColor: dept.bg,
                  transition: 'box-shadow 0.35s ease',
                  boxShadow: isOpen ? `0 8px 32px ${dept.accent}22` : 'none',
                }}
                onClick={() => setHovered(isOpen ? null : i)}>

                {/* Glow desde la esquina superior-derecha */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: dept.glow }} />

                {/* Header siempre visible */}
                <div className="relative flex items-center gap-4 px-5 py-4">
                  <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: 38, height: 38,
                      backgroundColor: `${dept.accent}1e`,
                      border: `1px solid ${dept.accent}35`,
                      transition: 'background 0.3s ease',
                    }}>
                    <Icon size={16} style={{ color: dept.accent }} />
                  </div>
                  <h3 className="font-barlow font-bold uppercase text-[1rem] tracking-wide flex-1"
                    style={{ color: dept.text }}>{dept.name}</h3>
                  <span style={{
                    color: dept.accent,
                    fontSize: 22,
                    display: 'block',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                    lineHeight: 1,
                  }}>+</span>
                </div>

                {/* Contenido animado */}
                <div style={{
                  maxHeight: isOpen ? '400px' : '0px',
                  overflow: 'hidden',
                  transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)',
                }}>
                  <div style={{
                    padding: '0 20px 20px',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
                    transition: 'opacity 0.35s ease 0.08s, transform 0.35s ease 0.08s',
                  }}>
                    <p className="font-inter text-[13px] mb-4" style={{ color: dept.text, opacity: 0.6 }}>{dept.tagline}</p>
                    <ul className="flex flex-col gap-2 mb-4">
                      {dept.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2.5 font-inter text-[13px]"
                          style={{ color: dept.text, opacity: 0.75 }}>
                          <span className="mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: dept.accent }} />{b}
                        </li>
                      ))}
                    </ul>
                    {/* Métrica: número grande translúcido + label al lado, leyéndose
                        como una frase ("+65% de leads cualificados") */}
                    <div className="flex items-baseline gap-2.5 pt-3"
                      style={{ borderTop: `1px solid ${dept.accent}28` }}>
                      <span className="font-barlow font-bold leading-none flex-shrink-0"
                        style={{ fontSize: '2.6rem', color: dept.accent, opacity: 0.42, lineHeight: 1 }}>
                        {dept.bigNum}
                      </span>
                      <span className="font-inter text-[13px] leading-snug"
                        style={{ color: dept.text, opacity: 0.6 }}>{dept.metricLabel}</span>
                    </div>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {/* ── DESKTOP: paneles horizontales ── */}
        <div ref={panelsRef} className="hidden md:flex gap-[6px] h-[480px]">
          {departments.map((dept, i) => {
            const isHovered  = hovered === i
            const anyHovered = hovered !== null
            const isOther    = anyHovered && !isHovered
            const { Icon }   = dept

            return (
              <div
                key={i}
                className="dept-panel relative overflow-hidden cursor-pointer"
                style={{
                  flex: isHovered ? '3.5' : isOther ? '0.42' : '1',
                  backgroundColor: dept.bg,
                  borderRadius: '12px',
                  transition: `flex ${EASE}`,
                  minWidth: '58px',
                  flexShrink: 0,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Glow desde la esquina superior-derecha */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: dept.glow }}
                />

                {/* Número decorativo — esquina inferior-derecha */}
                <div
                  className="absolute right-[-0.05em] bottom-[-0.1em] font-barlow font-bold leading-none pointer-events-none select-none"
                  style={{
                    fontSize: 'clamp(7rem,14vw,13rem)',
                    color: dept.accent,
                    opacity: isHovered ? 0.07 : 0,
                    transition: `opacity ${EASE}`,
                    lineHeight: 1,
                  }}
                >
                  {dept.bigNum}
                </div>

                {/* Icono + título: se deslizan del centro al top-left */}
                <div
                  className="absolute left-6"
                  style={{
                    top: isHovered ? '28px' : 'calc(50% - 36px)',
                    transition: `top ${EASE}`,
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg mb-3"
                    style={{
                      width: isHovered ? '38px' : '42px',
                      height: isHovered ? '38px' : '42px',
                      backgroundColor: `${dept.accent}1e`,
                      border: `1px solid ${dept.accent}35`,
                      transition: `width ${EASE}, height ${EASE}`,
                      opacity: isOther ? 0 : 1,
                    }}
                  >
                    <Icon size={isHovered ? 16 : 18} style={{ color: dept.accent, transition: `all ${EASE}` }} />
                  </div>

                  <h3
                    className="font-barlow font-bold uppercase leading-tight"
                    style={{
                      color: dept.text,
                      letterSpacing: '0.02em',
                      fontSize: isHovered ? 'clamp(1.4rem,2vw,1.9rem)' : '0.82rem',
                      opacity: isOther ? 0 : 1,
                      transition: `font-size ${EASE}, opacity 0.35s ease`,
                      whiteSpace: isHovered ? 'normal' : 'nowrap',
                    }}
                  >
                    {dept.name}
                  </h3>

                  <p
                    className="font-inter text-[13px] leading-snug mt-1.5 max-w-xs"
                    style={{
                      color: dept.text,
                      opacity: isHovered ? 0.58 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                      transition: `opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s`,
                    }}
                  >
                    {dept.tagline}
                  </p>
                </div>

                {/* Bullets + métrica label */}
                <div
                  className="absolute bottom-7 left-6 right-6"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    pointerEvents: isHovered ? 'auto' : 'none',
                  }}
                >
                  <ul className="flex flex-col gap-2 mb-5">
                    {dept.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 font-inter text-[13px] leading-snug"
                        style={{
                          color: dept.text,
                          opacity: isHovered ? 0.75 : 0,
                          transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                          transition: `opacity 0.3s ease ${0.18 + j * 0.07}s, transform 0.3s ease ${0.18 + j * 0.07}s`,
                        }}
                      >
                        <span className="mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dept.accent }} />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* Label alineado a la derecha — se superpone al gran número
                      translúcido de la esquina inferior-derecha */}
                  <div
                    className="flex items-baseline justify-end pt-4"
                    style={{
                      borderTop: `1px solid ${dept.accent}28`,
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
                      transition: `opacity 0.3s ease 0.44s, transform 0.3s ease 0.44s`,
                    }}
                  >
                    <span className="font-inter text-[13px] text-right" style={{ color: dept.text, opacity: 0.55 }}>
                      {dept.metricLabel}
                    </span>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        <p
          className="hidden md:block text-center text-[11px] font-inter text-[#111111]/25 mt-4 tracking-wide"
          style={{ opacity: hovered === null ? 1 : 0, transition: 'opacity 0.3s ease' }}
        >
          Pasa el cursor sobre cada área
        </p>

      </div>
    </section>
  )
}
