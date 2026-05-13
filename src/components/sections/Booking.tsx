'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar } from 'lucide-react'
import MagneticButton from '@/components/shared/MagneticButton'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const BOOKING_URL = 'https://calendar.app.google/Xezqc3mQe6yi23k26'

export default function Booking() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.booking-content',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%', toggleActions: 'play none none none' } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} id="contacto" className="bg-[#0A0A0A] py-24 border-t border-white/[0.04]">
      <div className="booking-content max-w-2xl mx-auto px-6 text-center">

        <p className="text-[11px] font-inter uppercase tracking-[0.18em] text-[#2DD4BF] mb-4">
          Hablemos
        </p>

        <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-inter font-semibold leading-tight tracking-[-0.03em] text-white mb-4">
          ¿Listo para escalar<br/>
          <span className="text-[#2DD4BF]">con inteligencia?</span>
        </h2>

        <p className="text-[15px] font-inter text-white/45 leading-relaxed mb-10 max-w-md mx-auto">
          30 minutos con un especialista. Analizamos tu negocio, detectamos dónde pierdes tiempo y dinero, y te decimos exactamente qué automatizar.
        </p>

        <MagneticButton
          href={BOOKING_URL}
          className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0F766E] text-white text-[15px] font-inter font-medium rounded-lg glow-pulse hover:bg-[#0d6960] transition-colors"
        >
          <Calendar size={16} />
          Reservar consultoría gratuita
        </MagneticButton>

        <p className="mt-5 text-[12px] font-inter text-white/20">
          O escríbenos a{' '}
          <a href="mailto:victor.vallejo@esentiaagency.es"
            className="text-white/35 hover:text-[#2DD4BF] transition-colors">
            victor.vallejo@esentiaagency.es
          </a>
        </p>

      </div>
    </section>
  )
}
