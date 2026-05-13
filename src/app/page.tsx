"use client"
import Hero from "@/components/sections/Hero"
import Problem from "@/components/sections/Problem"
import Services from "@/components/sections/Services"
import Process from "@/components/sections/Process"
import CaseStudies from "@/components/sections/CaseStudies"
import Interstitial from "@/components/sections/Interstitial"
import Calculator from "@/components/sections/Calculator"
import FAQ from "@/components/sections/FAQ"
import Booking from "@/components/sections/Booking"
import Footer from "@/components/sections/Footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <Problem />
      <Interstitial />
      <Services />
      <Process />

      {/*
        ── Transición Calculator → FAQ ─────────────────────────────────────
        300vh de scroll total: ~80vh de reposo en Calculator, ~150vh de wipe,
        el resto para leer FAQ. Ambas secciones absolutas dentro del mismo
        sticky — FAQ detrás (z10), Calculator delante (z20).
        El ScrollTrigger clipea Calculator de abajo hacia arriba.
      */}
      {/* bg oscuro para que nunca asome blanco durante el scroll */}
      {/* GSAP pin congela el scroll aquí — igual que Interstitial */}
      <div id="calc-faq-wrap" style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
        {/* FAQ — detrás, siempre quieta */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, overflow: 'hidden' }}>
          <FAQ />
        </div>
        {/* Calculator — delante, se borra de abajo hacia arriba */}
        <div id="calc-sticky-inner" style={{ position: 'absolute', inset: 0, zIndex: 20, overflow: 'hidden' }}>
          <Calculator />
        </div>
      </div>

      <div style={{ marginTop: 0 }}>
        <CaseStudies />
      </div>
      <Booking />
      <Footer />
    </main>
  )
}
