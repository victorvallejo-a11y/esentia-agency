'use client'
import { useEffect, useRef } from 'react'

// Canvas compartido que abarca dos secciones (oscura arriba, clara abajo)
// Las partículas cambian de color al cruzar la frontera
export default function SharedParticles({ splitRatio = 0.5 }: { splitRatio?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const wrap   = wrapRef.current!
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    const N = 140
    let W = 0, H = 0

    function resize() {
      W = wrap.offsetWidth  || window.innerWidth
      H = wrap.offsetHeight || window.innerHeight * 2
      canvas.width  = Math.round(W * devicePixelRatio)
      canvas.height = Math.round(H * devicePixelRatio)
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }
    resize()

    const pts = Array.from({ length: N }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.22,
      r:  2.2 + Math.random() * 3.8,
      opacity: 0.4 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      freq:  0.15 + Math.random() * 0.2,
    }))

    const start = performance.now()
    let raf: number

    // Devuelve color según si el punto está en zona oscura o clara
    function getColor(y: number, alpha: number): string {
      const boundary = H * splitRatio
      // Zona oscura (Calculator): teal brillante
      // Zona clara (FAQ): teal oscuro
      const t = Math.max(0, Math.min(1, (y - boundary * 0.85) / (H * 0.15)))
      const r = Math.round(45  + (15  - 45)  * t)
      const g = Math.round(212 + (118 - 212) * t)
      const b = Math.round(191 + (110 - 191) * t)
      return `rgba(${r},${g},${b},${alpha.toFixed(3)})`
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      ctx.clearRect(0, 0, W, H)
      const t = (now - start) * 0.001

      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0)  { p.x = 0;  p.vx *= -1 }
        if (p.x > W)  { p.x = W;  p.vx *= -1 }
        if (p.y < 0)  { p.y = 0;  p.vy *= -1 }
        if (p.y > H)  { p.y = H;  p.vy *= -1 }

        const op = p.opacity * (0.55 + 0.45 * Math.sin(t * p.freq * Math.PI * 2 + p.phase))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = getColor(p.y, op)
        ctx.fill()
      }

      // Líneas entre puntos cercanos
      const MAX = 180
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX) {
            const midY = (pts[i].y + pts[j].y) / 2
            const alpha = 0.28 * (1 - d / MAX)
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = getColor(midY, alpha)
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }
    }

    raf = requestAnimationFrame(tick)
    const onResize = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); resize() }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [splitRatio])

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  )
}
