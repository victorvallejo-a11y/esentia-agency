"use client"
import dynamic from 'next/dynamic'
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

const SharedParticles = dynamic(() => import('@/components/canvas/SharedParticles'), { ssr: false })

export default function Home() {
  return (
    <main>
      <Hero />
      <Problem />
      <Interstitial />
      <Services />
      <Process />

      {/* Canvas compartido que abarca Calculator + FAQ */}
      <div style={{ position: 'relative' }}>
        <SharedParticles splitRatio={0.5} />
        <Calculator />
        <FAQ />
      </div>

      <CaseStudies />
      <Booking />
      <Footer />
    </main>
  )
}
