'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    q: '¿Cuánto tarda en estar listo?',
    a: 'Depende de lo que necesites. Hay soluciones que están en marcha en dos semanas y otras que toman más. Lo que siempre ocurre es que cada paso se valida contigo antes de avanzar — sin sorpresas.',
  },
  {
    q: '¿Necesito saber de tecnología para usarlo?',
    a: 'Para nada. Tú nos explicas qué problema tienes y nosotros lo resolvemos. No necesitas entender cómo funciona por dentro, igual que no necesitas saber mecánica para conducir un coche.',
  },
  {
    q: '¿Funciona con las herramientas que ya uso?',
    a: 'En la mayoría de casos sí. WhatsApp, Google Calendar, HubSpot, Salesforce, sistemas de reservas, facturación... Lo vemos en detalle en el diagnóstico gratuito y te decimos exactamente qué encaja.',
  },
  {
    q: '¿Qué pasa si la IA comete un error?',
    a: 'Está diseñado para que el humano siempre pueda intervenir. Hay registros de todo lo que ocurre, alertas cuando algo no va bien y sistemas de revisión. Lo monitorizamos activamente.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Varía según el proyecto y el alcance. Lo importante: en la consultoría gratuita te decimos exactamente cuánto sería y cuánto tardarías en recuperarlo.',
  },
  {
    q: '¿Puedo cancelar si no me convence?',
    a: 'Sí, sin permanencia. No te retenemos con contratos. Preferimos que te quedes porque ves el resultado, no porque no puedas irte.',
  },
]

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge slides in from left
      gsap.fromTo('.faq-badge',
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.faq-header', start: 'top 82%', toggleActions: 'play none none none' } }
      )

      // Title: big word-by-word reveal
      gsap.fromTo('.faq-title-word',
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.75, ease: 'power4.out', stagger: 0.09,
          scrollTrigger: { trigger: '.faq-header', start: 'top 82%', toggleActions: 'play none none none' } }
      )

      // Divider line expands
      gsap.fromTo('.faq-divider',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.9, ease: 'power3.inOut', delay: 0.3,
          scrollTrigger: { trigger: '.faq-header', start: 'top 82%', toggleActions: 'play none none none' } }
      )

      // FAQ items: alternating slide-in from left/right
      gsap.utils.toArray<HTMLElement>('.faq-item').forEach((el, i) => {
        const fromX = i % 2 === 0 ? -60 : 60
        gsap.fromTo(el,
          { x: fromX, opacity: 0, scale: 0.96 },
          {
            x: 0, opacity: 1, scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="faq" className="relative bg-[#F0F0E8] w-full py-28 overflow-hidden">

      <div className="relative z-10 w-full max-w-3xl mx-auto px-8">

        <div className="faq-header mb-12">
          <div className="faq-badge inline-block mb-4">
            <p className="text-[11px] font-inter uppercase tracking-[0.18em] text-[#0F766E]">
              Preguntas frecuentes
            </p>
          </div>

          {/* Title with per-word clip reveal */}
          <div className="overflow-hidden">
            <h2 className="text-[clamp(2.2rem,4vw,3.4rem)] font-inter font-semibold leading-tight tracking-[-0.03em] text-[#111111] flex flex-wrap gap-x-3">
              {['Lo', 'que', 'nos', 'suelen'].map((word, i) => (
                <span key={i} className="faq-title-word inline-block">{word}</span>
              ))}
              <span className="faq-title-word inline-block text-[#0F766E]">preguntar</span>
            </h2>
          </div>

          {/* Animated divider */}
          <div className="faq-divider mt-6 h-px bg-[#0F766E]/30" />
        </div>

        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="faq-item border-b border-[#1A1A1A]/[0.08] cursor-pointer group"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center justify-between gap-6 py-5">
                <h3
                  className="font-inter font-medium leading-snug transition-colors duration-200"
                  style={{
                    fontSize: 'clamp(15px, 1.5vw, 19px)',
                    color: open === i ? '#0F766E' : '#1A1A1A',
                  }}
                >
                  {faq.q}
                </h3>
                <div
                  className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    borderColor: open === i ? '#0F766E' : 'rgba(26,26,26,0.15)',
                    color: open === i ? '#0F766E' : 'rgba(26,26,26,0.35)',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    background: open === i ? 'rgba(15,118,110,0.07)' : 'transparent',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div style={{ maxHeight: open === i ? '200px' : '0px', overflow: 'hidden', transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)' }}>
                <p className="font-inter text-[14px] text-[#1A1A1A]/55 leading-relaxed pb-5 max-w-xl">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing stamp */}
        <div className="mt-16 text-center" style={{ opacity: 0, animation: 'faqClose 0.8s 0.4s ease forwards' }}>
          <style>{`@keyframes faqClose { from { opacity:0; transform: translateY(20px) } to { opacity:1; transform: translateY(0) } }`}</style>
          <p className="text-[13px] font-inter text-[#1A1A1A]/35 tracking-wide">
            ¿Tienes otra pregunta?{' '}
            <a href="https://wa.me/34711237051" className="text-[#0F766E] underline underline-offset-2 hover:text-[#0d6960] transition-colors">
              Escríbenos directamente
            </a>
          </p>
        </div>

      </div>
    </section>
  )
}
