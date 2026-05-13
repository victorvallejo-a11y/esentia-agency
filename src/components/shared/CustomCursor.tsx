'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const current = useRef({ x: -100, y: -100 })

  useEffect(() => {
    // Only on pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    if (!dot) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onEnter = () => dot.classList.add('expanded')
    const onLeave = () => dot.classList.remove('expanded')

    window.addEventListener('mousemove', onMove)

    const interactives = document.querySelectorAll<HTMLElement>(
      'a, button, [data-cursor="pointer"], input, textarea'
    )
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    let raf: number
    const loop = () => {
      current.current.x += (pos.current.x - current.current.x) * 0.85
      current.current.y += (pos.current.y - current.current.y) * 0.85
      if (dot) {
        dot.style.left = current.current.x + 'px'
        dot.style.top = current.current.y + 'px'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot hidden md:block" aria-hidden="true" />
}
