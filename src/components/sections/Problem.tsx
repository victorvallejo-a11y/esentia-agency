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

      // Play once — toggleActions never reverses
      gsap.fromTo('.stat-cell',
        { y: 52, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="problema" className="bg-[#111111] text-white py-28 relative z-10">
      <div className="max-w-6xl mx-auto px-6">

        <RevealOnScroll className="mb-16 max-w-2xl">
          <p className="text-[12px] font-inter uppercase tracking-[0.15em] text-[#2DD4BF] mb-4">El problema</p>
          <h2 className="text-[clamp(2.2rem,3.5vw,2.6rem)] font-inter font-semibold leading-tight tracking-[-0.02em]">
            Cada minuto que tardas en responder,{' '}
            <em className="not-italic text-white/60">alguien mas lo hace</em>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05] rounded-2xl overflow-hidden mb-14">

          {/* Outer bg always matches section — hides the gap during translateY animation */}
          <div className="bg-[#111111] overflow-hidden">
            <div className="stat-cell p-8 md:p-10 flex flex-col gap-3">
              <div className="font-mono font-semibold text-[#EF4444] leading-none" style={{fontSize:'clamp(3.5rem,8vw,6rem)'}}>
                <AnimatedCounter target={62} suffix="%" className="tabular-nums"/>
              </div>
              <p className="text-[14px] font-inter text-white/55 leading-snug max-w-xs">
                de los leads se pierden por no responder en menos de 5 minutos
              </p>
            </div>
          </div>

          <div className="bg-[#111111] overflow-hidden">
            <div className="stat-cell p-8 md:p-10 flex flex-col gap-3">
              <div className="font-mono font-semibold text-[#F59E0B] leading-none" style={{fontSize:'clamp(3.5rem,8vw,6rem)'}}>
                <AnimatedCounter target={45} suffix="%" className="tabular-nums"/>
              </div>
              <p className="text-[14px] font-inter text-white/55 leading-snug max-w-xs">
                de las tareas de una empresa son automatizables con tecnología ya disponible hoy
              </p>
            </div>
          </div>

          <div className="bg-[#111111] overflow-hidden">
            <div className="stat-cell p-8 md:p-10 flex flex-col gap-3">
              <div className="font-mono font-semibold text-[#10B981] leading-none" style={{fontSize:'clamp(3.5rem,8vw,6rem)'}}>
                <AnimatedCounter target={30} suffix="%" className="tabular-nums"/>
              </div>
              <p className="text-[14px] font-inter text-white/55 leading-snug max-w-xs">
                de reducción en costes operativos logran las empresas que automatizan sus procesos clave
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
