'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Btn } from './ui'

const DESK = 861

/* ── Esfera: nube con profundidad → condensa con rebote ──────────────────
   Cada punto sale de una posición 3D aleatoria y aterriza en la esfera de
   Fibonacci con un backOut exagerado (se pasa de su sitio y vuelve). Al
   aterrizar, un pulso teal recorre la esfera. */
function startOrb(cv: HTMLCanvasElement, hero: HTMLElement) {
  const ctx = cv.getContext('2d')
  if (!ctx) return () => {}
  const desk = window.innerWidth >= DESK
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = matchMedia('(pointer: coarse)').matches
  const N = desk ? 1300 : 640
  const PHI = Math.PI * (3 - Math.sqrt(5))
  type P = { tx: number; ty: number; tz: number; sx: number; sy: number; sz: number; ox: number; oy: number; s: number; d: number }
  const pts: P[] = []
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = PHI * i
    pts.push({
      tx: Math.cos(th) * r, ty: y, tz: Math.sin(th) * r,
      sx: (Math.random() * 2 - 1) * 2.8, sy: (Math.random() * 2 - 1) * 2.0, sz: (Math.random() * 2 - 1) * 2.8,
      ox: 0, oy: 0, s: 0.5 + Math.random() * 1.2, d: Math.random(),
    })
  }

  let W = 0, H = 0, R = 0, cx = 0, cy = 0
  const slot = hero.querySelector('.orb-slot') as HTMLElement | null
  function size() {
    const rect = cv.getBoundingClientRect()
    const dpr = Math.min(desk ? 2 : 1.5, window.devicePixelRatio || 1)
    W = rect.width
    H = rect.height
    cv.width = Math.round(W * dpr)
    cv.height = Math.round(H * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (window.innerWidth >= DESK || !slot) {
      R = H * 0.36
      cx = W / 2
      cy = H * 0.52
    } else {
      // Móvil: la esfera vive en el hueco entre los dos titulares.
      const s = slot.getBoundingClientRect()
      R = Math.min(s.width * 0.44, s.height * 0.5)
      cx = s.left - rect.left + s.width / 2
      cy = s.top - rect.top + s.height / 2
    }
  }
  size()
  let lastW = window.innerWidth
  const onResize = () => {
    // En móvil la barra del navegador cambia la altura: solo recalculamos si cambia el ancho.
    if (!desk && window.innerWidth === lastW) return
    lastW = window.innerWidth
    size()
  }
  window.addEventListener('resize', onResize)

  let rotY = 0, rotX = 0, tRotY = 0, tRotX = 0, mx = -1e4, my = -1e4, t = 0, running = true
  let t0: number | null = null
  const START = 0.9, SPREAD = 1.0, DUR = 1.7
  const c1 = 2.9, c3 = c1 + 1
  const backOut = (x: number) => {
    x = Math.min(1, Math.max(0, x))
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
  }
  const LAND = START + SPREAD + DUR * 0.62

  const onMove = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect()
    mx = e.clientX - r.left
    my = e.clientY - r.top
    tRotY = (mx / W - 0.5) * 0.9
    tRotX = (my / H - 0.5) * -0.55
  }
  const onLeave = () => {
    mx = my = -1e4
    tRotX = 0
    tRotY = 0
  }
  if (!coarse) {
    hero.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('pointerleave', onLeave)
  }

  function draw(now: number) {
    if (t0 === null) t0 = now
    const el = (now - t0) / 1000
    const settle = Math.min(1, Math.max(0, (el - (START + SPREAD + DUR * 0.6)) / 1.2))
    t += 0.0022 * (0.35 + 0.65 * settle)
    rotY += (tRotY - rotY) * 0.045
    rotX += (tRotX - rotX) * 0.045
    const ay = t + rotY * settle, ax = rotX * settle
    const cyA = Math.cos(ay), syA = Math.sin(ay), cxA = Math.cos(ax), sxA = Math.sin(ax)
    const RR = R * (1 + Math.sin(t * 3) * 0.012)
    ctx!.clearRect(0, 0, W, H)
    const RAD = 120, RAD2 = RAD * RAD
    ctx!.fillStyle = 'rgb(15,118,110)'
    for (let i = 0; i < N; i++) {
      const q = pts[i]
      const lp = (el - START - q.d * SPREAD) / DUR
      const e = backOut(lp)
      const drift = (1 - Math.min(1, Math.max(0, lp))) * 0.06
      const x = q.sx + (q.tx - q.sx) * e + Math.sin(el * 0.8 + q.d * 6) * drift
      const y = q.sy + (q.ty - q.sy) * e + Math.cos(el * 0.7 + q.d * 5) * drift
      const z = q.sz + (q.tz - q.sz) * e
      const x1 = x * cyA - z * syA
      let z1 = x * syA + z * cyA
      const y2 = y * cxA - z1 * sxA
      z1 = y * sxA + z1 * cxA
      const persp = 1.55 / (1.55 - z1 * 0.42)
      let px = cx + x1 * RR * persp, py = cy + y2 * RR * persp
      const dx = px - mx, dy = py - my, d2 = dx * dx + dy * dy
      if (d2 < RAD2) {
        const d = Math.sqrt(d2) || 1, f = 1 - d / RAD, push = f * f * 40 * settle
        q.ox += ((dx / d) * push - q.ox) * 0.22
        q.oy += ((dy / d) * push - q.oy) * 0.22
      } else {
        q.ox *= 0.9
        q.oy *= 0.9
      }
      px += q.ox
      py += q.oy
      const depth = Math.min(1, Math.max(0, (z1 + 2.8) / 5.6))
      ctx!.globalAlpha = 0.1 + depth * 0.8
      ctx!.beginPath()
      ctx!.arc(px, py, q.s * (0.4 + depth * 1.9), 0, 6.2832)
      ctx!.fill()
    }
    ctx!.globalAlpha = 1
    // Pulso al aterrizar: un anillo suave que viaja del centro al borde.
    const pt = (el - LAND) / 0.8
    if (pt > 0 && pt < 1) {
      const ring = R * pt, w = R * 0.2
      const g = ctx!.createRadialGradient(cx, cy, Math.max(0, ring - w), cx, cy, Math.min(R * 1.05, ring + w))
      const a = (0.16 * (1 - pt)).toFixed(3)
      g.addColorStop(0, 'rgba(15,118,110,0)')
      g.addColorStop(0.5, `rgba(15,118,110,${a})`)
      g.addColorStop(1, 'rgba(15,118,110,0)')
      ctx!.fillStyle = g
      ctx!.fillRect(cx - R * 1.1, cy - R * 1.1, R * 2.2, R * 2.2)
      ctx!.fillStyle = 'rgb(15,118,110)'
    }
  }

  let raf = 0
  const loop = (now: number) => {
    if (!running) return
    draw(now)
    raf = requestAnimationFrame(loop)
  }
  let io: IntersectionObserver | null = null
  if (reduced) {
    requestAnimationFrame((n) => {
      t0 = n - 1e5
      draw(n)
    })
  } else {
    io = new IntersectionObserver(
      (en) => {
        const vis = en[0].isIntersecting
        if (vis && !running) {
          running = true
          raf = requestAnimationFrame(loop)
        } else if (!vis) running = false
      },
      { threshold: 0.02 },
    )
    io.observe(cv)
    raf = requestAnimationFrame(loop)
  }

  return () => {
    running = false
    cancelAnimationFrame(raf)
    io?.disconnect()
    window.removeEventListener('resize', onResize)
    hero.removeEventListener('pointermove', onMove)
    hero.removeEventListener('pointerleave', onLeave)
  }
}

/* ── Intro de titulares ───────────────────────────────────────────────────
   Escritorio: los dos bloques nacen centrados y simétricos y viajan a sus
   esquinas mientras la esfera condensa. Móvil: aparecen en cascada. */
function intro(hero: HTMLElement) {
  const A = hero.querySelector('.h-a') as HTMLElement
  const B = hero.querySelector('.h-b') as HTMLElement
  const C = hero.querySelector('.hero-copy') as HTMLElement
  const hint = hero.querySelector('.hero-hint') as HTMLElement
  hero.classList.add('hero-live')
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set([A, B, C, hint], { opacity: 1 })
    return null
  }
  return gsap.context(() => {
    if (window.innerWidth < DESK) {
      gsap.set([A, B, C], { opacity: 0, y: 14, filter: 'blur(10px)' })
      gsap.to([A, B, C], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.28, ease: 'power2.out', delay: 0.35, clearProps: 'filter' })
      return
    }
    const hr = hero.getBoundingClientRect(), ra = A.getBoundingClientRect(), rb = B.getBoundingClientRect()
    const midX = hr.left + hr.width / 2, midY = hr.top + hr.height * 0.5, gap = 16
    const aX = midX - (ra.left + ra.width / 2), aY = midY - gap - (ra.top + ra.height)
    const bX = midX - (rb.left + rb.width / 2), bY = midY + gap - rb.top
    const lineOffsets = (block: HTMLElement, dir: number) => {
      const ws = Array.from(block.querySelectorAll('.ln > span')) as HTMLElement[]
      const max = Math.max(...ws.map((s) => s.getBoundingClientRect().width))
      return ws.map((s) => ({ el: s, x: (dir * (max - s.getBoundingClientRect().width)) / 2 }))
    }
    const lines = [...lineOffsets(A, 1), ...lineOffsets(B, -1)]
    lines.forEach((o) => gsap.set(o.el, { x: o.x }))
    gsap.set(A, { x: aX, y: aY, opacity: 0, filter: 'blur(14px)' })
    gsap.set(B, { x: bX, y: bY, opacity: 0, filter: 'blur(14px)' })
    gsap.set([C, hint], { opacity: 0, y: 14 })
    gsap
      .timeline()
      .to(A, { opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }, 0.35)
      .to(B, { opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }, 0.55)
      .to([A, B], { x: 0, y: 0, duration: 1.9, ease: 'expo.inOut' }, 1.5)
      .to(lines.map((o) => o.el), { x: 0, duration: 1.9, ease: 'expo.inOut' }, 1.5)
      .to(C, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 3.1)
      .to(hint, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 3.5)
      .set([A, B], { clearProps: 'filter' })
  }, hero)
}

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const hero = root.current
    if (!hero) return
    // Si la pestaña está en segundo plano, que la intro no avance a cámara lenta.
    gsap.ticker.lagSmoothing(0)
    const stopOrb = startOrb(hero.querySelector('canvas') as HTMLCanvasElement, hero)
    const ctx = intro(hero)
    return () => {
      stopOrb()
      ctx?.revert()
    }
  }, [])

  return (
    <section className="hero" id="inicio" ref={root} aria-label="Portada">
      <div className="hero-glow" aria-hidden="true" />
      <canvas className="hero-orb" aria-hidden="true" />
      <div className="hero-ui">
        <h1 className="hero-h">
          <span className="h-a">
            <span className="ln"><span>Tu negocio</span></span>
            <span className="ln"><span>no duerme.</span></span>
          </span>
          <span className="orb-slot" aria-hidden="true" />
          <span className="h-b">
            <span className="ln"><span>Tus procesos</span></span>
            <span className="ln"><span className="t">tampoco.</span></span>
          </span>
        </h1>
        <div className="hero-copy">
          <p>
            <b>Consultoría de IA.</b> Encontramos el cuello de botella de tu negocio y construimos el sistema que lo quita.
          </p>
          <div className="cta-row">
            <Btn href="#agenda">Quiero mi diagnóstico gratis</Btn>
            <Btn href="#caso" variant="ghost">Ver un caso real</Btn>
          </div>
        </div>
      </div>
      <div className="hero-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
