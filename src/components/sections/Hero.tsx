'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import MagneticButton from '@/components/shared/MagneticButton'
import RevealOnScroll from '@/components/shared/RevealOnScroll'
import { ArrowRight, MessageCircle, ChevronDown } from 'lucide-react'

const Canvas3D = dynamic(() => import('@/components/canvas/Canvas3D'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <svg width="360" height="360" viewBox="0 0 360 360" className="opacity-25">
        <defs>
          <radialGradient id="sg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0F766E" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#0F766E" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="180" cy="180" r="160" fill="url(#sg)">
          <animateTransform attributeName="transform" type="rotate" from="0 180 180" to="360 180 180" dur="25s" repeatCount="indefinite"/>
        </circle>
        {Array.from({length:16}).map((_,i)=>{
          const a=(i/16)*Math.PI*2; const r2=120+Math.sin(i*1.8)*35
          return <circle key={i} cx={180+Math.cos(a)*r2} cy={180+Math.sin(a)*r2} r={2+(i%3)} fill="#0F766E" opacity={0.3+(i%5)*0.1}>
            <animateTransform attributeName="transform" type="rotate" from="0 180 180" to="360 180 180" dur={`${18+i*1.5}s`} repeatCount="indefinite"/>
          </circle>
        })}
      </svg>
    </div>
  ),
})

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  // Instagram in-app browser: lock height to a px value captured at mount.
  // Instagram fires resize when its bottom nav bar shows/hides, which would
  // change any CSS viewport unit (svh/dvh/vh) and bounce the layout.
  // null = regular browser (keeps 100svh from CSS).
  const [igHeight, setIgHeight] = useState<number | null>(null)
  const isInsta = igHeight !== null

  useEffect(() => {
    if (/Instagram/i.test(navigator.userAgent)) {
      setIgHeight(window.innerHeight)
    }

    const ctx = gsap.context(() => {
      const IN = { filter: 'blur(18px)', opacity: 0, y: 8 }
      const OUT = { filter: 'blur(0px)',  opacity: 1, y: 0, duration: 0.62, ease: 'power2.out' }

      // Título izquierdo — grupo, ambas líneas juntas
      gsap.fromTo(['.h-line-1', '.h-line-2'], IN, { ...OUT, delay: 0.4 })

      // Título derecho — "Tu atención" + "al cliente" juntos
      gsap.fromTo(['.h-line-3', '.h-line-4'], IN, { ...OUT, delay: 2.0 })

      // "tampoco" — 1s después, sincronizado con la onda del canvas
      gsap.fromTo('.h-line-5', IN, { ...OUT, delay: 3.1 })

      // CTAs (desktop) y scroll — tras el "tampoco"
      gsap.fromTo('.hero-ctas',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 4.0 }
      )
      gsap.fromTo('.hero-scroll',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 4.8 }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <section
        ref={heroRef}
        id="inicio"
        className="relative w-full bg-[#FAFAF7] overflow-hidden"
        style={{ height: igHeight ? `${igHeight}px` : '100svh' }}
      >

        {/* Canvas — fondo. Posición vertical de la esfera por dispositivo:
            móvil normal baja la esfera (top 5%), Instagram la sube un poco. */}
        <div
          className="absolute inset-0 z-0 md:top-0"
          style={{ top: isInsta ? 'calc(-9.2% + 53px)' : 'calc(5% - 19px)' }}
        >
          <Canvas3D />
        </div>

        {/* ── DESKTOP: layout scattered ── */}
        <div className="hidden md:block">
          <div className="absolute z-10" style={{ top: '138px', left: '98px', maxWidth: '750px' }}>
            <h1 className="font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A]"
              style={{ fontSize: 'clamp(3.04rem, 4.8vw, 4.32rem)' }}>
              <span className="h-line-1 block">Tu negocio</span>
              <span className="h-line-2 block">no duerme</span>
            </h1>
          </div>

          <div className="absolute z-10 text-right" style={{ bottom: '100px', right: '60px' }}>
            <h1 className="font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A]"
              style={{ fontSize: 'clamp(3.04rem, 4.8vw, 4.32rem)' }}>
              <span className="h-line-3 block">Tu atención</span>
              <span className="h-line-4 block">al cliente</span>
              <span className="h-line-5 block text-[#0F766E]">tampoco</span>
            </h1>
          </div>

          <div className="hero-ctas absolute z-10 flex items-center gap-4 flex-wrap justify-center" style={{ bottom: '36px', left: 0, right: 0 }}>
            <MagneticButton href="#calculadora"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0F766E] text-white text-[15px] font-inter font-medium rounded-lg glow-pulse hover:bg-[#0d6960] transition-colors">
              Calcula lo que estas perdiendo<ArrowRight size={15}/>
            </MagneticButton>
            <MagneticButton href="https://wa.me/34711237051"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-[15px] font-inter font-medium rounded-lg border border-[#1A1A1A]/15 text-[#1A1A1A] hover:border-[#0F766E] hover:text-[#0F766E] transition-all duration-200 bg-white/60 backdrop-blur-sm">
              <MessageCircle size={15}/>WhatsApp
            </MagneticButton>
          </div>
        </div>

        {/* ── MOBILE: texto arriba, esfera en medio, texto abajo.
            Los botones NO van aquí: viven en una franja bajo el fold. ── */}
        <div className="md:hidden absolute left-0 right-0 z-10 text-center px-6"
          style={{ top: isInsta ? 'calc(3% + 49px)' : 'calc(5% + 38px)' }}>
          <h1 className="font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A]" style={{ fontSize: '3.3rem' }}>
            <span className="h-line-1 block">Tu negocio</span>
            <span className="h-line-2 block">no duerme</span>
          </h1>
        </div>

        <div className="md:hidden absolute left-0 right-0 z-10 px-5 text-center"
          style={{ top: isInsta ? 'calc(70% + 38px)' : 'calc(76% - 8px)' }}>
          <h1 className="font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A]" style={{ fontSize: '3.3rem' }}>
            <span className="h-line-3 block">Tu atención</span>
            <span className="h-line-4 block">al cliente</span>
            <span className="h-line-5 block text-[#0F766E]">tampoco</span>
          </h1>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown size={14} className="scroll-indicator text-[#64748B]"/>
        </div>

      </section>

      {/* ── MOBILE: franja de botones bajo el fold — aparecen al deslizar
          (RevealOnScroll: fade-up al entrar en viewport, escalonados) ── */}
      <div className="md:hidden bg-[#FAFAF7] px-5 pt-2 pb-10 flex flex-col items-center gap-3">
        <RevealOnScroll className="w-full" delay={0}>
          <a href="#calculadora"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#0F766E] text-white text-[15px] font-inter font-medium rounded-xl">
            Calcula lo que pierdes<ArrowRight size={15}/>
          </a>
        </RevealOnScroll>
        <RevealOnScroll className="w-full" delay={120}>
          <a href="https://wa.me/34711237051"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-[15px] font-inter font-medium rounded-xl border border-[#1A1A1A]/15 text-[#1A1A1A] bg-white/60">
            <MessageCircle size={15}/>WhatsApp
          </a>
        </RevealOnScroll>
      </div>
    </>
  )
}
