'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RevealOnScroll from '@/components/shared/RevealOnScroll'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Diagnóstico',
    duration: '1 semana',
    desc: 'Analizamos tu negocio, procesos actuales y oportunidades de automatización.',
  },
  {
    num: '02',
    title: 'Diseño',
    duration: '1-2 semanas',
    desc: 'Diseñamos la solución a medida con flujos, integraciones y experiencia de usuario.',
  },
  {
    num: '03',
    title: 'Implementación',
    duration: '2-4 semanas',
    desc: 'Construimos, probamos y desplegamos. Tú validas cada paso.',
  },
  {
    num: '04',
    title: 'Optimización',
    duration: 'Continuo',
    desc: 'Monitorizamos resultados y mejoramos con datos reales de tu negocio.',
  },
]

export default function Process() {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#proceso',
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: true,
          }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="proceso" className="bg-dark text-white py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <RevealOnScroll direction="left" className="mb-20">
          <p className="text-[12px] font-inter uppercase tracking-[0.15em] text-tealText mb-4">Cómo funciona</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-inter font-semibold leading-tight tracking-[-0.02em]">
            De idea a resultado en{' '}
            <span className="text-tealText">4-8 semanas.</span>
          </h2>
        </RevealOnScroll>

        {/* Timeline — desktop horizontal, mobile vertical */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[60px] right-[60px] h-px bg-white/[0.08]">
            <div ref={lineRef} className="absolute inset-0 bg-teal origin-left" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <RevealOnScroll key={i} delay={i * 100} direction="up">
                <div className="flex flex-col gap-4">
                  {/* Number circle */}
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                    <div className="relative z-10 w-[52px] h-[52px] rounded-full border border-white/[0.12] bg-dark flex items-center justify-center flex-shrink-0">
                      <span className="font-mono text-[13px] font-medium text-tealText">{step.num}</span>
                    </div>
                    {/* Mobile connector */}
                    <div className="lg:hidden flex-1 h-px bg-white/[0.08]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-[16px] font-inter font-semibold text-white">{step.title}</h3>
                      <span className="text-[11px] font-mono text-teal border border-teal/30 rounded-full px-2 py-0.5">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-[14px] font-inter text-white/55 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
