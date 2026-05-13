'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Diagnóstico',
    desc: 'Analizamos tu negocio a fondo: qué consumes, dónde pierdes tiempo y dónde está el dinero que se escapa.',
    detail: 'Una sesión de trabajo contigo para entender tus procesos reales, no los del papel. Salimos con un mapa claro de qué automatizar primero.',
    color: '#2DD4BF',
  },
  {
    num: '02',
    title: 'Diseño',
    desc: 'Diseñamos la solución exacta para tu negocio. Sin plantillas, sin genéricos.',
    detail: 'Flujos, integraciones, experiencia de usuario — todo pensado para que encaje en cómo trabajas tú, no al revés.',
    color: '#2DD4BF',
  },
  {
    num: '03',
    title: 'Implementación',
    desc: 'Construimos, probamos y desplegamos. Tú validas cada paso antes de que salga a producción.',
    detail: 'No desaparecemos en una cueva. Hay comunicación constante, versiones de prueba y cero sorpresas.',
    color: '#2DD4BF',
  },
  {
    num: '04',
    title: 'Optimización',
    desc: 'Cuando está vivo, empieza lo bueno. Monitorizamos y mejoramos con datos reales.',
    detail: 'La IA aprende, el sistema mejora solo. Tú ves los resultados, nosotros hacemos que sigan creciendo.',
    color: '#2DD4BF',
  },
]

export default function Process() {
  const sectionRef  = useRef<HTMLElement>(null)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.process-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.process-header', start: 'top 85%', toggleActions: 'play none none none' } }
      )

      // Pasos alternan: impares desde izquierda, pares desde derecha
      gsap.utils.toArray<HTMLElement>('.process-step').forEach((el, i) => {
        const fromX = i % 2 === 0 ? -60 : 60
        gsap.fromTo(el,
          { x: fromX, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' },
            delay: i * 0.08,
          }
        )
      })

      // Línea vertical que crece al scrollear
      gsap.fromTo('.process-vline',
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
            end: 'bottom 60%',
            scrub: true,
          }
        }
      )

      // Dot viajero que baja por la línea
      gsap.fromTo('.process-dot',
        { top: '0%' },
        { top: '100%', ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
            end: 'bottom 60%',
            scrub: true,
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="proceso" className="bg-[#111111] text-white py-32">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="process-header mb-20">
          <p className="text-[11px] font-inter uppercase tracking-[0.18em] text-[#2DD4BF] mb-3">Cómo funciona</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-inter font-semibold leading-tight tracking-[-0.02em]">
            De idea a resultado,{' '}
            <span className="text-[#2DD4BF]">a tu ritmo.</span>
          </h2>
        </div>

        {/* Timeline vertical */}
        <div className="relative flex gap-16">

          {/* Línea + dot viajero */}
          <div className="hidden md:block relative flex-shrink-0 mt-2" style={{ width: '2px' }}>
            {/* Track fondo */}
            <div className="absolute inset-0 bg-white/[0.07] rounded-full" />
            {/* Línea que crece */}
            <div className="process-vline absolute inset-0 bg-[#2DD4BF] rounded-full origin-top" />
            {/* Dot viajero */}
            <div
              className="process-dot absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#2DD4BF] shadow-[0_0_12px_#2DD4BF]"
              style={{ top: '0%', marginTop: '-6px' }}
            />
          </div>

          {/* Pasos */}
          <div className="flex flex-col gap-0 flex-1">
            {steps.map((step, i) => (
              <div
                key={i}
                className="process-step group cursor-pointer"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                onClick={() => setActive(active === i ? null : i)}
              >
                <div className="py-8 flex items-start gap-6">
                  {/* Número */}
                  <span
                    className="font-mono text-[13px] font-medium flex-shrink-0 mt-0.5 transition-colors duration-300"
                    style={{ color: active === i ? '#2DD4BF' : 'rgba(255,255,255,0.2)' }}
                  >
                    {step.num}
                  </span>

                  <div className="flex-1 min-w-0">
                    {/* Título + flecha */}
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h3
                        className="text-[clamp(1.1rem,2vw,1.4rem)] font-inter font-semibold leading-tight transition-colors duration-300"
                        style={{ color: active === i ? '#ffffff' : 'rgba(255,255,255,0.65)' }}
                      >
                        {step.title}
                      </h3>
                      {/* Indicador expand */}
                      <div
                        className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-400"
                        style={{
                          borderColor: active === i ? '#2DD4BF' : 'rgba(255,255,255,0.12)',
                          transform: active === i ? 'rotate(45deg)' : 'rotate(0deg)',
                          color: active === i ? '#2DD4BF' : 'rgba(255,255,255,0.3)',
                          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Desc siempre visible */}
                    <p className="text-[14px] font-inter text-white/45 leading-relaxed">
                      {step.desc}
                    </p>

                    {/* Detail — se expande al click */}
                    <div
                      style={{
                        maxHeight: active === i ? '120px' : '0px',
                        overflow: 'hidden',
                        transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    >
                      <p className="text-[13px] font-inter text-[#2DD4BF]/70 leading-relaxed pt-3 pb-1">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
