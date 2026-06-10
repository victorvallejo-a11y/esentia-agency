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
      // Clip-reveal por línea: sube desde abajo con leve giro
      // [L1, L2] título izquierdo — [L3, L4] título derecho
      const lines  = ['.h-line-1', '.h-line-2', '.h-line-3', '.h-line-4']
      const delays = [0.4, 0.57, 2.0, 2.17]
      lines.forEach((sel, i) => {
        gsap.fromTo(sel,
          { y: '108%', rotate: 2, transformOrigin: 'bottom left' },
          { y: '0%', rotate: 0, duration: 0.72, ease: 'power3.out', delay: delays[i] }
        )
      })
      // CTAs y scroll
      gsap.fromTo('.hero-ctas',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 3.2 }
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
        <div className="absolute z-10" style={{ top: '138px', left: '143px', maxWidth: '750px' }}>
          <h1 className="font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A]"
            style={{ fontSize: 'clamp(3.8rem, 6vw, 5.4rem)' }}>
            <div style={{ overflow: 'hidden' }}>
              <span className="h-line-1 inline-block">Tu negocio</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <span className="h-line-2 inline-block">no duerme</span>
            </div>
          </h1>
        </div>

        <div className="absolute z-10 text-right" style={{ bottom: '100px', right: '60px' }}>
          <h1 className="font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A]"
            style={{ fontSize: 'clamp(3.8rem, 6vw, 5.4rem)' }}>
            <div style={{ overflow: 'hidden' }}>
              <span className="h-line-3 inline-block">Tu atención</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <span className="h-line-4 inline-block" style={{ whiteSpace: 'nowrap' }}>
                al cliente, <span className="text-[#0F766E]">tampoco</span>
              </span>
            </div>
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
      <div className="md:hidden absolute top-[13%] left-0 right-0 z-10 text-center px-6">
        <h1 className="font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A] text-[2.9rem]">
          <div style={{ overflow: 'hidden' }}>
            <span className="h-line-1 inline-block">Tu negocio</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span className="h-line-2 inline-block">no duerme</span>
          </div>
        </h1>
      </div>

      {/* Título inferior + botones */}
      <div className="md:hidden absolute bottom-[5%] left-0 right-0 z-10 px-5 flex flex-col items-center gap-3">
        <h1 className="font-barlow font-bold uppercase leading-[0.95] tracking-[0.02em] text-[#1A1A1A] text-[2.9rem] text-center">
          <div style={{ overflow: 'hidden' }}>
            <span className="h-line-3 inline-block">Tu atención</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span className="h-line-4 inline-block" style={{ whiteSpace: 'nowrap' }}>
              al cliente, <span className="text-[#0F766E]">tampoco</span>
            </span>
          </div>
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
