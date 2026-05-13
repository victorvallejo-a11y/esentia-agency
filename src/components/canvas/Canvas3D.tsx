'use client'
import { useEffect, useRef } from 'react'

export default function Canvas3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const wrap   = wrapRef.current!
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const N         = 900
    const GA        = Math.PI * (3 - Math.sqrt(5))
    const R         = 0.36
    const TRAVEL    = 3050
    const DELAY_MAX = 200

    // Impacto: 0.3s antes de que terminen — sensación de golpe anticipado
    const IMPACT_AT  = DELAY_MAX / 2 + TRAVEL - 300   // ~2850ms
    const PULSE_DUR  = 700   // duración del pulso teal
    const SWELL_DUR  = 900   // duración de la onda (más lenta = más sutil)
    const WAVE_SPREAD = 520  // ms que tarda la onda en ir del centro al borde

    function eOB(t: number): number {
      const c1 = 1.33, c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    }

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

    // Inicializar fuera del canvas para evitar el efecto donut al cargar
    let mx = -9999, my = -9999
    let mouseActive = false
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mx = e.clientX - rect.left
      my = e.clientY - rect.top
      mouseActive = true
    }
    window.addEventListener('mousemove', onMouse)

    let rotX = 0, rotY = 0, autoRotY = 0
    // También el tilt del mouse arranca neutral hasta que se mueva
    let smTargetX = 0, smTargetY = 0

    interface Pt {
      hx: number; hy: number; hz: number
      sx: number; sy: number
      delay: number
      vx: number; vy: number
      turbAngle: number
      phase: number    // fase de respiración individual
      breathR: number  // amplitud de respiración (varía por punto)
      breathF: number  // frecuencia de respiración (varía por punto)
    }

    const pts: Pt[] = []
    const maxDim = Math.max(W, H)

    for (let i = 0; i < N; i++) {
      const hy_v = 1 - (i / (N - 1)) * 2
      const hr   = Math.sqrt(Math.max(0, 1 - hy_v * hy_v))
      const hth  = GA * i
      const hx   = Math.cos(hth) * hr
      const hz   = Math.sin(hth) * hr
      const hy   = hy_v

      const ang = Math.random() * Math.PI * 2
      const d   = maxDim * 0.85 + Math.random() * maxDim * 0.55
      pts.push({
        hx, hy, hz,
        sx: Math.cos(ang) * d,
        sy: Math.sin(ang) * d,
        delay: Math.random() * DELAY_MAX,
        vx: 0, vy: 0,
        turbAngle: Math.random() * Math.PI * 2,
        phase:    Math.random() * Math.PI * 2,          // offset de fase único
        breathR:  0.012 + Math.random() * 0.018,        // amplitud 1.2%–3%
        breathF:  0.28  + Math.random() * 0.22,         // frecuencia 0.28–0.5 Hz
      })
    }

    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      ctx.clearRect(0, 0, W, H)

      const elapsed = now - start

      // ── Rotación: rápida al inicio, decelera a normal en 3.2s ─────────
      const ROT_FAST = 0.008, ROT_NORM = 0.0018, ROT_DECEL = 3200
      autoRotY += elapsed < ROT_DECEL
        ? ROT_NORM + (ROT_FAST - ROT_NORM) * Math.pow(1 - elapsed / ROT_DECEL, 2)
        : ROT_NORM

      // Tilt solo cuando el mouse ha entrado en la página
      if (mouseActive) {
        smTargetX = ((my / H) * 2 - 1) * 0.35
        smTargetY = ((mx / W) * 2 - 1) * 0.45
      }
      rotX += (smTargetX - rotX) * 0.035
      rotY += (smTargetY - rotY) * 0.035

      const totalRotY = autoRotY + rotY

      const sR = Math.min(W, H) * R

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
      const cosY = Math.cos(totalRotY), sinY = Math.sin(totalRotY)

      type Proj = { x: number; y: number; z: number; depthNorm: number; edgeness: number; progress: number }
      const projected: Proj[] = []

      for (let i = 0; i < N; i++) {
        const p = pts[i]
        const t        = Math.max(0, Math.min(1, (elapsed - p.delay) / TRAVEL))
        const progress = t < 1 ? eOB(t) : 1

        const x1 =  p.hx * cosY + p.hz * sinY
        const z1 = -p.hx * sinY + p.hz * cosY
        const y1 =  p.hy * cosX - z1  * sinX
        const z2 =  p.hy * sinX + z1  * cosX

        // Onda que viaja del centro al borde: puntos frontales primero, silhoueta después
        const edgenessRaw = Math.sqrt(x1 * x1 + y1 * y1)
        // Onda acotada: solo aplica si edgeness ≤ 1 (dentro del circulo)
        const waveT = (elapsed - IMPACT_AT - edgenessRaw * WAVE_SPREAD) / SWELL_DUR
        const waveSwell = (waveT > 0 && waveT < 1 && edgenessRaw <= 1)
          ? 1 + 0.042 * Math.sin(waveT * Math.PI) * (1 - edgenessRaw * 0.5)
          : 1

        // Respiración orbital individual — solo activa cuando la esfera está formada
        const breathAmt = progress >= 1
          ? p.breathR * Math.sin(elapsed * 0.001 * p.breathF * Math.PI * 2 + p.phase)
          : 0
        const tx = W / 2 + x1 * sR * waveSwell * (1 + breathAmt)
        const ty = H / 2 - y1 * sR * waveSwell * (1 + breathAmt)
        const cx = W / 2 + p.sx * (1 - progress) + (tx - W / 2) * progress
        const cy = H / 2 + p.sy * (1 - progress) + (ty - H / 2) * progress

        const dx = cx - mx, dy = cy - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const REPEL_R = 155
        if (mouseActive && dist < REPEL_R && dist > 0) {
          const falloff = 1 - dist / REPEL_R
          const force   = falloff * falloff * 8
          // 30% repulsión real + 70% dirección caótica por punto → nube, no imán
          const TURB = 0.70
          const dirX = (dx / dist) * (1 - TURB) + Math.cos(p.turbAngle) * TURB
          const dirY = (dy / dist) * (1 - TURB) + Math.sin(p.turbAngle) * TURB
          p.vx += dirX * force
          p.vy += dirY * force
          p.turbAngle += 0.15   // gira más rápido → más caótico
        }
        p.vx *= 0.975
        p.vy *= 0.975

        projected.push({
          x: cx + p.vx, y: cy + p.vy, z: z2,
          depthNorm: (z2 + 1) / 2,
          edgeness: edgenessRaw,
          progress,
        })
      }

      projected.sort((a, b) => a.z - b.z)

      for (const p of projected) {
        if (p.progress <= 0) continue
        const contourBoost = 1 + p.edgeness * 0.6
        const dn = p.depthNorm
        const size    = (1.2 + dn * 0.8) * contourBoost
        const opacity = (0.55 + dn * 0.35) * Math.min(1, p.progress * 1.5)
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${Math.round(12 + dn*8)},${Math.round(90 + dn*45)},${Math.round(85 + dn*35)},${opacity.toFixed(3)})`
        ctx.fill()
      }

      // ── Pulso teal: anillo fino que viaja del centro al borde y muere ahí ──
      const pulseT = (elapsed - IMPACT_AT) / PULSE_DUR
      if (pulseT > 0 && pulseT < 1) {
        const spherePx = Math.min(W, H) * R
        const ringPos  = spherePx * pulseT             // posición del anillo (0 → spherePx)
        const ringW    = spherePx * 0.18               // anchura del anillo
        const inner    = Math.max(0, ringPos - ringW)
        const outer    = Math.min(spherePx, ringPos + ringW)  // jamás sale del círculo
        const alpha    = 0.20 * (1 - pulseT)           // se desvanece al llegar al borde
        const grad = ctx.createRadialGradient(W/2, H/2, inner, W/2, H/2, outer)
        grad.addColorStop(0,   `rgba(15,118,110,0)`)
        grad.addColorStop(0.5, `rgba(15,118,110,${alpha.toFixed(3)})`)
        grad.addColorStop(1,   `rgba(15,118,110,0)`)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, W, H)
      }
    }

    raf = requestAnimationFrame(tick)
    const onResize = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); resize() }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  )
}
