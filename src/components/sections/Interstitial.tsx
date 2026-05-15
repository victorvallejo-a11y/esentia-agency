'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

// Palabras separadas para animación palabra a palabra — más cinematográfico
const WORDS = [
  { text: 'El',        teal: false },
  { text: '78%',       teal: false },
  { text: 'de',        teal: false },
  { text: 'los',       teal: false },
  { text: 'clientes',  teal: false },
  { text: 'compra',    teal: false },
  { text: 'al',        teal: false },
  { text: 'primero',   teal: false },
  { text: 'que',       teal: false },
  { text: 'responde.', teal: false },
  { text: '¿Eres',     teal: true  },
  { text: 'tú?',       teal: true  },
]

export default function Interstitial() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rule = innerRef.current?.querySelector('.i-rule') as HTMLElement
      const sub  = innerRef.current?.querySelector('.i-sub')  as HTMLElement

      // Entrada del contenedor
      gsap.fromTo(innerRef.current,
        { y: 80, opacity: 0, filter: 'blur(12px)' },
        {
          y: 0, opacity: 1, filter: 'blur(0px)',
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 110%',
            end: 'top 20%',
            scrub: 0.7,
          }
        }
      )

      // PIN scroll-driven — más largo para que se pueda leer bien
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: '+=280%',
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
        }
      })

      // Línea decorativa
      tl.fromTo(rule,
        { scaleX: 0, transformOrigin: 'center center' },
        { scaleX: 1, duration: 0.18, ease: 'power2.inOut' }, 0)

      // Cada palabra sube desde abajo con stagger — cinematográfico
      const wordEls = gsap.utils.toArray<HTMLElement>('.i-word-inner')
      wordEls.forEach((el, i) => {
        tl.fromTo(el,
          { y: '105%', opacity: 0 },
          { y: '0%',   opacity: 1, duration: 0.28, ease: 'power3.out' },
          0.12 + i * 0.055
        )
      })

      // Color teal en las últimas dos palabras
      tl.fromTo('.i-teal',
        { color: '#ffffff' },
        { color: '#2DD4BF', duration: 0.18, ease: 'power2.inOut' },
        0.12 + (WORDS.length - 1) * 0.055 + 0.1
      )

      // Subtítulo
      tl.fromTo(sub,
        { y: 18, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.22, ease: 'power2.out' },
        0.12 + (WORDS.length - 1) * 0.055 + 0.22
      )

      // Pausa larga para que el lector pueda absorber
      tl.to({}, { duration: 0.35 })

      // Salida suave
      tl.to(wordEls,
        { y: '-60px', opacity: 0, duration: 0.22, ease: 'power2.in', stagger: 0.03 })
      tl.to([rule, sub], { opacity: 0, duration: 0.15, ease: 'power1.in' }, '<+0.04')

    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{ backgroundColor: '#0D0D0D', position: 'relative', zIndex: 20, marginTop: '-2px' }}
      className="overflow-hidden"
    >
      <div
        ref={innerRef}
        className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center"
      >
        <div className="i-rule mb-10 h-px w-16 bg-[#0F766E]" style={{ transformOrigin: 'center center' }} />

        {/* Contenedor flex-wrap — las palabras fluyen y cada una se anima sola */}
        <div
          className="flex flex-wrap justify-center font-inter font-semibold leading-[1.12] tracking-[-0.03em] text-white"
          style={{
            fontSize: 'clamp(2.8rem, 7.5vw, 6rem)',
            gap: '0 0.22em',
            maxWidth: '18ch',
          }}
        >
          {WORDS.map((w, i) => (
            <span key={i} className="overflow-hidden" style={{ display: 'inline-block' }}>
              <span
                className={`i-word-inner inline-block${w.teal ? ' i-teal text-white' : ''}`}
              >
                {w.text}
              </span>
            </span>
          ))}
        </div>

        <p className="i-sub mt-10 text-[clamp(0.9rem,1.6vw,1.05rem)] font-inter text-white/40 max-w-md leading-relaxed">
          Cada minuto sin respuesta es una venta que ya tiene tu competencia.
          Automatiza y deja de perder clientes por algo que tiene solución.
        </p>
      </div>
    </div>
  )
}
