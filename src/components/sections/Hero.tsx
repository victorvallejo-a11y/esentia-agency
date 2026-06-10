'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import MagneticButton from '@/components/shared/MagneticButton'
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left title: golpe seco — scale + slide + fade
      gsap.fromTo('.hero-title-left',
        { y: 40, opacity: 0, scale: 1.06 },
        { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.4)', delay: 0.2 }
      )
      // Texto 2: mismo golpe, 1.2s después
      gsap.fromTo('.hero-title-right',
        { y: 40, opacity: 0, scale: 1.06 },
        { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.4)', delay: 1.4 }
      )
      // CTAs: tras la esfera
      gsap.fromTo('.hero-ctas',
        { y: 20, opacity: 0, scale: 1.03 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)', delay: 3.2 }
      )
      gsap.fromTo('.hero-scroll',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 4.1 }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} id="inicio" className="relative w-full h-screen bg-[#FAFAF7] overflow-hidden">

      {/* Canvas — background, en móvil lo subimos un poco */}
      <div className="absolute inset-0 z-0 md:top-0 -top-[8%]">
        <Canvas3D />
      </div>

      {/* ── DESKTOP: layout scattered ── */}
      <div className="hidden md:block">
        <div className="hero-title-left absolute z-10" style={{ top: '195px', left: '136px', maxWidth: '400px' }}>
          <h1 className="font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A]"
            style={{ fontSize: 'clamp(2.4rem, 3.84vw, 3.6rem)' }}>
            Tu negocio<br/>no duerme
          </h1>
        </div>

        <div className="hero-title-right absolute z-10 text-right" style={{ bottom: '100px', right: '72px', maxWidth: '680px' }}>
          <h1 className="font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A]"
            style={{ fontSize: 'clamp(2.4rem, 3.84vw, 3.6rem)' }}>
            Tu atención<br/>
            <span style={{whiteSpace:'nowrap'}}>al cliente, <span className="text-[#0F766E]">tampoco</span></span>
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

      {/* ── MOBILE: texto arriba, esfera en medio, texto+botones abajo ── */}
      {/* Título superior */}
      <div className="md:hidden absolute top-[13%] left-0 right-0 z-10 text-center px-6">
        <h1 className="hero-title-left font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A] text-[2.9rem]">
          Tu negocio<br/>no duerme
        </h1>
      </div>

      {/* Título inferior + botones */}
      <div className="md:hidden absolute bottom-[5%] left-0 right-0 z-10 px-5 flex flex-col items-center gap-3">
        <h1 className="hero-title-right font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A] text-[2.9rem] text-center">
          Tu atención<br/><span style={{whiteSpace:'nowrap'}}>al cliente, <span className="text-[#0F766E]">tampoco</span></span>
        </h1>
        <div className="hero-ctas flex flex-col items-center gap-3 w-full mt-2">
          <a href="#calculadora"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#0F766E] text-white text-[15px] font-inter font-medium rounded-xl">
            Calcula lo que pierdes<ArrowRight size={15}/>
          </a>
          <a href="https://wa.me/34711237051"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-[15px] font-inter font-medium rounded-xl border border-[#1A1A1A]/15 text-[#1A1A1A] bg-white/60">
            <MessageCircle size={15}/>WhatsApp
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown size={14} className="scroll-indicator text-[#64748B]"/>
      </div>

    </section>
  )
}
