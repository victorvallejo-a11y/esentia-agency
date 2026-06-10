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
  const [active, setActive]   = useState<number | null>(null)
  const [reached, setReached] = useState<boolean[]>(steps.map(() => false))

  useEffect(() => {
    const isMobile = window.innerWidth < 768

    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.process-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.process-header', start: 'top 85%', toggleActions: 'play none none none' } }
      )

      // Pasos — entrada alternada
      gsap.utils.toArray<HTMLElement>('.process-step').forEach((el, i) => {
        const fromX = isMobile ? 0 : (i % 2 === 0 ? -60 : 60)
        gsap.fromTo(el,
          { x: fromX, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
            delay: i * 0.08,
          }
        )
      })

      // Línea y dot — solo en desktop
      if (!isMobile) {
        gsap.fromTo('.process-vline',
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 55%', end: 'bottom 60%', scrub: true }
          }
        )
        gsap.fromTo('.process-dot',
          { top: '0%' },
          { top: '100%', ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 55%', end: 'bottom 60%', scrub: true }
          }
        )
      }

      // Iluminación de pasos al scroll — desktop Y mobile
      // El step se ilumina cuando su mitad superior entra en pantalla (~62% del viewport)
      gsap.utils.toArray<HTMLElement>('.process-step').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 65%',
          onEnter:     () => setReached(prev => { const n = [...prev]; n[i] = true;  return n }),
          onLeaveBack: () => setReached(prev => { const n = [...prev]; n[i] = false; return n }),
        })
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="proceso" className="bg-[#111111] text-white py-32">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="process-header mb-20">
          <p className="text-[11px] font-inter uppercase tracking-[0.18em] text-[#2DD4BF] mb-3">Cómo funciona</p>
          <h2 className="text-[clamp(2.3rem,4vw,3rem)] font-inter font-semibold leading-tight tracking-[-0.02em]">
            Proceso claro.{' '}
            <span className="text-[#2DD4BF]">Resultados concretos.</span>
          </h2>
        </div>

        {/* Timeline vertical */}
        <div className="relative flex gap-16">

          {/* Línea + dot viajero */}
          <div className="hidden md:block relative flex-shrink-0 mt-2" style={{ width: '2px' }}>
            <div className="absolute inset-0 bg-white/[0.07] rounded-full" />
            <div className="process-vline absolute inset-0 bg-[#2DD4BF] rounded-full origin-top" />
            <div
              className="process-dot absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#2DD4BF] shadow-[0_0_12px_#2DD4BF]"
              style={{ top: '0%', marginTop: '-6px' }}
            />
          </div>

          {/* Pasos */}
          <div className="flex flex-col gap-0 flex-1">
            {steps.map((step, i) => {
              const isLit    = reached[i]
              const isActive = active === i
              return (
                <div
                  key={i}
                  className="process-step group cursor-pointer"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  onClick={() => setActive(isActive ? null : i)}
                >
                  <div className="py-8 flex items-start gap-6">
                    {/* Número */}
                    <span
                      className="font-mono text-[13px] font-medium flex-shrink-0 mt-0.5"
                      style={{
                        color: isActive ? '#2DD4BF' : isLit ? '#2DD4BF' : 'rgba(255,255,255,0.2)',
                        transition: 'color 0.5s ease',
                      }}
                    >
                      {step.num}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <h3
                          className="text-[clamp(1.2rem,2vw,1.4rem)] font-inter font-semibold leading-tight"
                          style={{
                            color: isActive
                              ? '#ffffff'
                              : isLit
                              ? '#ffffff'
                              : 'rgba(255,255,255,0.35)',
                            transition: 'color 0.5s ease',
                            textShadow: isLit && !isActive ? '0 0 20px rgba(45,212,191,0.15)' : 'none',
                          }}
                        >
                          {step.title}
                        </h3>
                        <div
                          className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0"
                          style={{
                            borderColor: isActive ? '#2DD4BF' : 'rgba(255,255,255,0.12)',
                            transform: isActive ? 'rotate(45deg)' : 'rotate(0deg)',
                            color: isActive ? '#2DD4BF' : 'rgba(255,255,255,0.3)',
                            transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>

                      <p
                        className="text-[14px] font-inter leading-relaxed"
                        style={{
                          color: isLit ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)',
                          transition: 'color 0.5s ease',
                        }}
                      >
                        {step.desc}
                      </p>

                      <div
                        style={{
                          maxHeight: isActive ? '120px' : '0px',
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
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
