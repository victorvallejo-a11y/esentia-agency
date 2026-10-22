'use client'
import { useEffect } from 'react'

/** Cursor propio + botones magnéticos + inclinación de tarjetas. Solo con ratón. */
export default function Pointer() {
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const body = document.body
    const dot = document.createElement('div')
    const ring = document.createElement('div')
    dot.className = 'cur-dot'
    ring.className = 'cur-ring'
    body.append(dot, ring)
    body.classList.add('cur')

    let cx = -100, cy = -100, rx = -100, ry = -100, raf = 0
    const move = (e: PointerEvent) => {
      cx = e.clientX
      cy = e.clientY
      dot.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`
    }
    const loop = () => {
      rx += (cx - rx) * 0.18
      ry += (cy - ry) * 0.18
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      body.classList.toggle('hov', !!t.closest('a,button,input,label,[data-tilt],.slot,.day'))
      body.classList.toggle('on-dark-cur', !!t.closest('.act'))
    }

    // Magnéticos: el botón sigue un poco al cursor.
    const magMove = (e: PointerEvent) => {
      const b = (e.target as HTMLElement).closest('[data-magnet]') as HTMLElement | null
      if (!b) return
      const r = b.getBoundingClientRect()
      const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2)
      b.style.translate = `${(x * 0.18).toFixed(1)}px ${(y * 0.28).toFixed(1)}px`
    }
    const magOut = (e: PointerEvent) => {
      const b = (e.target as HTMLElement).closest('[data-magnet]') as HTMLElement | null
      if (b && !b.contains(e.relatedTarget as Node)) b.style.translate = ''
    }

    // Inclinación de tarjetas de vidrio + foco de luz que sigue al cursor.
    const tiltMove = (e: PointerEvent) => {
      const c = (e.target as HTMLElement).closest('[data-tilt]') as HTMLElement | null
      if (!c) return
      const r = c.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      c.style.setProperty('--mx', `${x}px`)
      c.style.setProperty('--my', `${y}px`)
      const rxv = (y / r.height - 0.5) * -5, ryv = (x / r.width - 0.5) * 6
      c.style.transform = `perspective(1100px) rotateX(${rxv.toFixed(2)}deg) rotateY(${ryv.toFixed(2)}deg)`
    }
    const tiltOut = (e: PointerEvent) => {
      const c = (e.target as HTMLElement).closest('[data-tilt]') as HTMLElement | null
      if (c && !c.contains(e.relatedTarget as Node)) c.style.transform = ''
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    document.addEventListener('pointermove', magMove, { passive: true })
    document.addEventListener('pointerout', magOut)
    document.addEventListener('pointermove', tiltMove, { passive: true })
    document.addEventListener('pointerout', tiltOut)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointermove', magMove)
      document.removeEventListener('pointerout', magOut)
      document.removeEventListener('pointermove', tiltMove)
      document.removeEventListener('pointerout', tiltOut)
      dot.remove()
      ring.remove()
      body.classList.remove('cur', 'hov', 'on-dark-cur')
    }
  }, [])
  return null
}
