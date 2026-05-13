'use client'
import { useEffect, useRef } from 'react'

// Versión zen del hero — mismos puntos, sin esfera, flotando despacio
export default function FloatingDots({ light = false }: { light?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const N = 70
    let W = 0, H = 0

    function resize() {
      W = wrap.offsetWidth  || window.innerWidth
      H = wrap.offsetHeight || window.innerHeight
      canvas.width  = Math.round(W * devicePixelRatio)
      canvas.height = Math.round(H * devicePixelRatio)
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }
    resize()

    // Puntos con posición aleatoria y movimiento suave propio
    const pts = Array.from({ length: N }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.18,
      r:  1.8 + Math.random() * 2.8,
      opacity: 0.35 + Math.random() * 0.50,
      phase: Math.random() * Math.PI * 2,
      freq:  0.18 + Math.random() * 0.22,
    }))

    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      ctx.clearRect(0, 0, W, H)
      const t = (now - start) * 0.001

      for (const p of pts) {
        // Movimiento flotante suave
        p.x += p.vx
        p.y += p.vy

        // Rebote en bordes con suavidad
        if (p.x < 0)  { p.x = 0;  p.vx *= -1 }
        if (p.x > W)  { p.x = W;  p.vx *= -1 }
        if (p.y < 0)  { p.y = 0;  p.vy *= -1 }
        if (p.y > H)  { p.y = H;  p.vy *= -1 }

        // Pulso de opacidad individual
        const op = p.opacity * (0.6 + 0.4 * Math.sin(t * p.freq * Math.PI * 2 + p.phase))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        // Sobre fondo claro los puntos son teal más oscuro y más visibles
        const [r, g, b] = light ? [15, 118, 110] : [45, 212, 191]
        const opFinal = light ? op * 0.85 : op
        ctx.fillStyle = `rgba(${r},${g},${b},${opFinal.toFixed(3)})`
        ctx.fill()
      }

      // Líneas entre puntos cercanos — red orgánica
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          const MAX = 160
          if (d < MAX) {
            const [r, g, b] = light ? [15, 118, 110] : [45, 212, 191]
            const alpha = light ? 0.18 : 0.30
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(${r},${g},${b},${(alpha * (1 - d / MAX)).toFixed(3)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
    }

    raf = requestAnimationFrame(tick)
    const onResize = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); resize() }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0 }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  )
}
