'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Scroll suave (solo rueda de ratón) sincronizado con el reloj de GSAP y ScrollTrigger. */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    ;(window as unknown as Record<string, unknown>).__lenis = lenis

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      // No dejar una instancia destruida colgada en window.
      const w = window as unknown as Record<string, unknown>
      if (w.__lenis === lenis) delete w.__lenis
    }
  }, [])

  return <>{children}</>
}
