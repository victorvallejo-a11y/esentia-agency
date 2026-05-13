"use client"
import Hero from "@/components/sections/Hero"
import Problem from "@/components/sections/Problem"
import Services from "@/components/sections/Services"
import Process from "@/components/sections/Process"
import CaseStudies from "@/components/sections/CaseStudies"
import Calculator from "@/components/sections/Calculator"
import Footer from "@/components/sections/Footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <Problem />
      <Services />
      <Process />
      <CaseStudies />
      <Calculator />
      <Footer />
    </main>
  )
}
