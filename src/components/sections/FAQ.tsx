'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const FloatingDots = dynamic(() => import('@/components/canvas/FloatingDots'), { ssr: false })

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
    // ── PIN + wipe — igual que Interstitial ──────────────────────────────
    // La página se congela aquí. El usuario scrollea "dentro" del pin.
    // 20% pausa Calculator → 60% wipe → 20% pausa FAQ → libera

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#calc-faq-wrap',
        pin: true,
        start: 'top top',
        end: '+=280%',
        scrub: true,
        anticipatePin: 1,
      }
    })

    // Pausa en Calculator
    tl.to({}, { duration: 0.2 })

    // Wipe de abajo hacia arriba, lineal puro
    tl.fromTo('#calc-sticky-inner',
      { clipPath: 'inset(0% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'none' }
    )

    // Pausa en FAQ
    tl.to({}, { duration: 0.2 })

    return () => { tl.scrollTrigger?.kill() }
  }, [])

  return (
    // h-screen: ocupa exactamente el viewport — no scrollea, es estática
    <section ref={sectionRef} id="faq" className="relative bg-white w-full h-full overflow-hidden flex flex-col justify-center" style={{ minHeight: '100vh' }}>

      {/* Partículas sobre blanco */}
      <div className="absolute inset-0 z-0">
        <FloatingDots light />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-8">

        <div className="faq-header mb-10">
          <p className="text-[11px] font-inter uppercase tracking-[0.18em] text-[#0F766E] mb-3">
            Preguntas frecuentes
          </p>
          <h2 className="text-[clamp(2.8rem,5vw,4.2rem)] font-inter font-semibold leading-tight tracking-[-0.03em] text-[#111111]">
            Lo que nos suelen{' '}
            <span className="text-[#0F766E]">preguntar</span>
          </h2>
        </div>

        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="faq-item border-t border-[#1A1A1A]/08 last:border-b cursor-pointer"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center justify-between gap-6 py-5">
                <h3
                  className="font-inter font-medium leading-snug transition-colors duration-200"
                  style={{
                    fontSize: 'clamp(17px, 1.6vw, 21px)',
                    color: open === i ? '#0F766E' : '#1A1A1A',
                  }}
                >
                  {faq.q}
                </h3>
                <div
                  className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0"
                  style={{
                    borderColor: open === i ? '#0F766E' : 'rgba(26,26,26,0.15)',
                    color: open === i ? '#0F766E' : 'rgba(26,26,26,0.35)',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div style={{ maxHeight: open === i ? '160px' : '0px', overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
                <p className="font-inter text-[14px] text-[#1A1A1A]/50 leading-relaxed pb-5 max-w-xl">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
