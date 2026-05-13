'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export default function Interstitial() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('.i-line')
      const rule  = innerRef.current?.querySelector('.i-rule') as HTMLElement
      const sub   = innerRef.current?.querySelector('.i-sub')  as HTMLElement

      // ── ENTRADA del contenedor: sube desde abajo con blur ───────────────
      // Diferente al wipe de Problem — aquí el bloque entero flota hacia arriba
      gsap.fromTo(innerRef.current,
        { y: 80, opacity: 0, filter: 'blur(12px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)',
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 100%',
            end: 'top 40%',
            scrub: 0.7,
          }
        }
      )

      // ── PIN + animación de texto scroll-driven ───────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        }
      })

      // Entrada de líneas
      tl.fromTo(rule,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.25, ease: 'power2.inOut' }, 0)

      lines.forEach((line, i) => {
        tl.fromTo(line,
          { y: 55, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' },
          0.15 + i * 0.18)
      })

      tl.fromTo('.i-teal',
        { color: '#ffffff' },
        { color: '#2DD4BF', duration: 0.18, ease: 'power2.inOut' },
        0.78)

      tl.fromTo(sub,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' },
        0.85)

      // Pausa
      tl.to({}, { duration: 0.28 })

      // Salida — sube y se evapora
      tl.to(lines, {
        y: -70, opacity: 0,
        duration: 0.28, ease: 'power2.in', stagger: 0.08,
      })
      tl.to([rule, sub], { opacity: 0, duration: 0.18, ease: 'power1.in' }, '<+0.05')

    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} style={{ backgroundColor: '#0D0D0D', position: 'relative', zIndex: 20, marginTop: '-2px' }} className="overflow-hidden">
      <div
        ref={innerRef}
        className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center"
      >
        <div
          className="i-rule mb-12 h-px w-20 bg-[#0F766E]"
          style={{ transformOrigin: 'left center' }}
        />

        <div
          className="font-inter font-semibold leading-[1.05] tracking-[-0.03em] text-white"
          style={{ fontSize: 'clamp(2.6rem, 5.5vw, 5.2rem)' }}
        >
          <div className="i-line overflow-hidden"><span className="block">El 78% de los clientes</span></div>
          <div className="i-line overflow-hidden"><span className="block">compra al primero que</span></div>
          <div className="i-line overflow-hidden">
            <span className="block">responde.{' '}
              <span className="i-teal text-white">¿Eres tú?</span>
            </span>
          </div>
        </div>

        <p className="i-sub mt-10 text-[clamp(0.85rem,1.5vw,1rem)] font-inter text-white/40 max-w-lg leading-relaxed">
          Cada minuto sin respuesta es una oportunidad que se va a tu competencia.
          La IA no descansa. Tú tampoco deberías tener que hacerlo.
        </p>
      </div>
    </div>
  )
}
