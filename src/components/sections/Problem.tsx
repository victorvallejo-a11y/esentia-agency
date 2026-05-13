'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedCounter from '@/components/shared/AnimatedCounter'
import RevealOnScroll from '@/components/shared/RevealOnScroll'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 100%',
            end: 'top 72%',
            scrub: 0.6,
          }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="problema" className="bg-[#111111] text-white py-28 relative z-10">
      <div className="max-w-6xl mx-auto px-6">

        <RevealOnScroll className="mb-16 max-w-2xl">
          <p className="text-[12px] font-inter uppercase tracking-[0.15em] text-[#2DD4BF] mb-4">El problema</p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-inter font-semibold leading-tight tracking-[-0.02em]">
            Cada minuto que tardas en responder,{' '}
            <em className="not-italic text-white/60">alguien mas lo hace</em>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05] rounded-2xl overflow-hidden mb-14">
          <RevealOnScroll delay={0} className="bg-[#111111] p-8 md:p-10 flex flex-col gap-3">
            <div className="font-mono font-semibold text-[#EF4444] leading-none" style={{fontSize:'clamp(3.5rem,8vw,6rem)'}}>
              <AnimatedCounter target={62} suffix="%" className="tabular-nums"/>
            </div>
            <p className="text-[14px] font-inter text-white/55 leading-snug max-w-xs">
              de los leads se pierden por no responder en menos de 5 minutos
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={80} className="bg-[#111111] p-8 md:p-10 flex flex-col gap-3">
            <div className="font-mono font-semibold text-[#F59E0B] leading-none" style={{fontSize:'clamp(3.5rem,8vw,6rem)'}}>
              3.0h
            </div>
            <p className="text-[14px] font-inter text-white/55 leading-snug max-w-xs">
              al dia respondiendo lo mismo. Preguntas repetitivas que podrian estar automatizadas
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={160} className="bg-[#111111] p-8 md:p-10 flex flex-col gap-3">
            <div className="font-mono font-semibold text-[#10B981] leading-none" style={{fontSize:'clamp(3.5rem,8vw,6rem)'}}>
              <AnimatedCounter target={23} suffix="%" className="tabular-nums"/>
            </div>
            <p className="text-[14px] font-inter text-white/55 leading-snug max-w-xs">
              de llamadas sin atender. Cada llamada perdida es un cliente en manos de tu competencia
            </p>
          </RevealOnScroll>
        </div>

      </div>
    </section>
  )
}
