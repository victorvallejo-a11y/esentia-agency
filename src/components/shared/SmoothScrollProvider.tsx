'use client'
import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    let raf: number
    const animate = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    // Expose lenis globally for GSAP integration
    ;(window as unknown as Record<string, unknown>).__lenis = lenis

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      // No dejar una instancia destruida colgada en window: si Lenis desaparece,
      // el navbar cae al fallback de scroll suave nativo en lugar de llamar a algo muerto.
      const w = window as unknown as Record<string, unknown>
      if (w.__lenis === lenis) delete w.__lenis
    }
  }, [])

  return <>{children}</>
}
