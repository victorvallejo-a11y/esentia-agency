'use client'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RevealOnScroll from '@/components/shared/RevealOnScroll'
import { ChevronLeft, ChevronRight } from 'lucide-react'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const cases = [
  { metric: '+340%', metricLabel: 'consultas atendidas', sector: 'Clinica Estetica', name: 'Dermacenter BCN', desc: 'Chatbot de WhatsApp que agenda citas 24/7 y responde dudas pre-tratamiento.' },
  { metric: '-65%', metricLabel: 'tiempo en llamadas', sector: 'Clinica Dental', name: 'OralMax Dental', desc: 'Recepcionista de voz que gestiona confirmaciones y recordatorios automaticamente.' },
  { metric: '3x', metricLabel: 'leads cualificados', sector: 'Inmobiliaria', name: 'Prime Real Estate', desc: 'Agente de captacion que filtra y cualifica compradores antes del primer contacto humano.' },
  { metric: '+28%', metricLabel: 'reservas online', sector: 'Restaurante', name: 'La Terraza BCN', desc: 'Sistema de reservas automatico con confirmacion por WhatsApp y recordatorio 2h antes.' },
  { metric: '-80%', metricLabel: 'tareas manuales', sector: 'Gimnasio', name: 'FitClub Barcelona', desc: 'Automatizacion de altas, bajas, pagos y seguimiento de asistencia de socios.' },
  { metric: '2.4x', metricLabel: 'velocidad de cierre', sector: 'Consultoria', name: 'Estrategia y Co.', desc: 'Flujo de propuestas automatizado con seguimiento y firma digital integrada.' },
]

export default function CaseStudies() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    duration: 30,
  })
  const [selected, setSelected] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.case-card',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="casos" className="relative py-28 overflow-hidden bg-[#111111]">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <RevealOnScroll direction="right" className="mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="text-[12px] font-inter uppercase tracking-[0.15em] text-[#2DD4BF] mb-4">Resultados reales</p>
            <h2 className="text-[clamp(2.3rem,4vw,2.8rem)] font-inter font-semibold leading-tight tracking-[-0.02em] text-white">
              Lo que pasa cuando la IA<br/>
              <span className="text-[#2DD4BF]">trabaja por ti</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-3 flex-shrink-0">
            <button onClick={prev} aria-label="Anterior"
              className="w-10 h-10 rounded-full border border-white/10 text-white/50 hover:border-[#2DD4BF] hover:text-[#2DD4BF] flex items-center justify-center transition-colors cursor-pointer">
              <ChevronLeft size={17}/>
            </button>
            <button onClick={next} aria-label="Siguiente"
              className="w-10 h-10 rounded-full border border-white/10 text-white/50 hover:border-[#2DD4BF] hover:text-[#2DD4BF] flex items-center justify-center transition-colors cursor-pointer">
              <ChevronRight size={17}/>
            </button>
          </div>
        </RevealOnScroll>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4" style={{touchAction:'pan-y'}}>
            {cases.map((c, i) => (
              <div key={i} className="case-card flex-none w-[min(320px,80vw)]">
                <div className="bg-[#111111] rounded-xl p-7 h-full flex flex-col gap-4"
                  style={{boxShadow:'0 0 0 1px rgba(15,118,110,0.12)'}}>
                  <div>
                    <span className="inline-block text-[11px] font-inter text-[#2DD4BF] border border-[#0F766E]/30 rounded-full px-2.5 py-0.5 mb-4">
                      {c.sector}
                    </span>
                    <div className="font-mono font-medium text-[#2DD4BF] leading-none mb-1" style={{fontSize:'clamp(2.2rem,5vw,3rem)'}}>
                      {c.metric}
                    </div>
                    <p className="text-[12px] font-inter text-white/40">{c.metricLabel}</p>
                  </div>
                  <div className="mt-auto border-t border-white/[0.06] pt-4">
                    <p className="text-[14px] font-inter font-semibold text-white mb-1">{c.name}</p>
                    <p className="text-[13px] font-inter text-white/50 leading-snug">{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {cases.map((_, i) => (
            <button key={i} onClick={() => emblaApi?.scrollTo(i)} aria-label={`Caso ${i+1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === selected ? 'w-6 bg-[#2DD4BF]' : 'w-1.5 bg-white/20'
              }`}/>
          ))}
        </div>
      </div>
    </section>
  )
}
