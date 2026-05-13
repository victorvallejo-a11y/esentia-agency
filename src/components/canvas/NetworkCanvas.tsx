'use client'

import { useEffect, useRef, useState } from 'react'
import type * as THREE from 'three'

/* ─────────────────────────────────────────
   SVG Fallback — shown when WebGL is unavailable
───────────────────────────────────────── */
function FallbackCanvas() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #191970 0%, #1E1E8A 50%, #191970 100%)' }}
    >
      <svg
        width="100%" height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="1" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Peripheral nodes */}
        {[
          [15, 25], [80, 18], [88, 72], [12, 75], [45, 12],
          [72, 45], [25, 55], [62, 82], [38, 68], [82, 35],
          [20, 42], [58, 25],
        ].map(([cx, cy], i) => (
          <g key={i}>
            {/* Glow */}
            <circle cx={`${cx}%`} cy={`${cy}%`} r="18" fill="url(#nodeGlow)" opacity="0.3">
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
            {/* Node */}
            <circle cx={`${cx}%`} cy={`${cy}%`} r="4" fill="#14B8A6" opacity="0">
              <animate attributeName="opacity" values="0;0.8;0.8" begin={`${i * 0.15}s`} dur="1s" fill="freeze" />
              <animate attributeName="opacity" values="0.5;0.9;0.5" begin={`${i * 0.15 + 1}s`} dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="r" values="3;5;3" begin={`${i * 0.15 + 1}s`} dur={`${3 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
            {/* Lines to center */}
            <line x1={`${cx}%`} y1={`${cy}%`} x2="50%" y2="50%" stroke="#0D9488" strokeWidth="0.5" opacity="0">
              <animate attributeName="opacity" values="0;0.2;0.2" begin={`${i * 0.15 + 0.5}s`} dur="0.8s" fill="freeze" />
              <animate attributeName="opacity" values="0.1;0.3;0.1" begin={`${i * 0.15 + 1.3}s`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </line>
            {/* Traveling particle */}
            <circle r="2" fill="#14B8A6" opacity="0">
              <animate attributeName="opacity" values="0;0.9;0" begin={`${i * 0.4}s`} dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" />
              <animateMotion
                begin={`${i * 0.4}s`}
                dur={`${1.8 + i * 0.3}s`}
                repeatCount="indefinite"
                calcMode="linear"
              >
                <mpath xlinkHref={`#path${i}`} />
              </animateMotion>
            </circle>
            <path id={`path${i}`} d={`M ${cx}% ${cy}% L 50% 50%`} fill="none" />
          </g>
        ))}

        {/* Central node */}
        <circle cx="50%" cy="50%" r="60" fill="url(#centralGlow)" opacity="0.25">
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="50%" cy="50%" r="14" fill="#0D9488" opacity="0">
          <animate attributeName="opacity" values="0;0.95;0.95" dur="1s" fill="freeze" />
          <animate attributeName="r" values="12;16;12" begin="1s" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Pulse ring */}
        <circle cx="50%" cy="50%" fill="none" stroke="#14B8A6" strokeWidth="1.5" opacity="0">
          <animate attributeName="r" values="16;60" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────
   Three.js Network Canvas
───────────────────────────────────────── */
export default function NetworkCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [webglFailed, setWebglFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // WebGL check
    try {
      const t = document.createElement('canvas')
      const g = t.getContext('webgl') || t.getContext('experimental-webgl')
      if (!g) { setWebglFailed(true); return }
    } catch {
      setWebglFailed(true)
      return
    }

    let rafId: number
    let disposeAll: (() => void) | null = null

    import('three').then((THREE) => {
      if (!container) return

      const NODE_COUNT = 40
      const W = container.clientWidth || window.innerWidth
      const H = container.clientHeight || window.innerHeight

      // ─── Renderer ───
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x191970, 1)
      Object.assign(renderer.domElement.style, {
        position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
      })
      container.appendChild(renderer.domElement)

      // ─── Scene + Fog ───
      const scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0x191970, 0.028)

      // ─── Camera ───
      const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100)
      camera.position.z = 28

      // ─── Node positions flat array ───
      // Index 0 = central node (x,y,z)
      // Index 1..NODE_COUNT = peripheral nodes
      const np = new Float32Array((NODE_COUNT + 1) * 3) // nodePositions

      // Peripheral velocities
      const vel = new Float32Array(NODE_COUNT * 3)
      for (let i = 0; i < NODE_COUNT; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi   = Math.acos(2 * Math.random() - 1)
        const r     = 4 + Math.random() * 9
        np[(i + 1) * 3]     = r * Math.sin(phi) * Math.cos(theta)
        np[(i + 1) * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65
        np[(i + 1) * 3 + 2] = (Math.random() - 0.5) * 6
        vel[i * 3]     = (Math.random() - 0.5) * 0.004
        vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003
        vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001
      }

      // ─── Node Meshes ───
      const nodeGeo  = new THREE.SphereGeometry(0.13, 8, 8)
      const nodeMeshes: THREE.Mesh[] = []
      for (let i = 0; i < NODE_COUNT; i++) {
        const t   = Math.random()
        const col = t < 0.33 ? 0x0D9488 : t < 0.66 ? 0x14B8A6 : 0x87CEEB
        const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0 })
        const m   = new THREE.Mesh(nodeGeo, mat)
        m.position.set(np[(i + 1) * 3], np[(i + 1) * 3 + 1], np[(i + 1) * 3 + 2])
        m.scale.setScalar(0)
        scene.add(m)
        nodeMeshes.push(m)
      }

      // ─── Central Node ───
      const cGeo  = new THREE.SphereGeometry(0.45, 16, 16)
      const cMat  = new THREE.MeshBasicMaterial({ color: 0x0D9488 })
      const cMesh = new THREE.Mesh(cGeo, cMat)
      scene.add(cMesh)

      const cTarget  = new THREE.Vector3()
      const cCurrent = new THREE.Vector3()

      // ─── Connections ───
      const pairs: [number, number][] = []
      for (let i = 1; i <= NODE_COUNT; i++) pairs.push([0, i]) // central ↔ each node
      for (let i = 1; i <= NODE_COUNT; i++) {
        for (let j = i + 1; j <= NODE_COUNT; j++) {
          const dx = np[i * 3] - np[j * 3]
          const dy = np[i * 3 + 1] - np[j * 3 + 1]
          const dz = np[i * 3 + 2] - np[j * 3 + 2]
          if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 8) pairs.push([i, j])
        }
      }
      const lineCount = pairs.length
      const lp = new Float32Array(lineCount * 6)
      const lGeo = new THREE.BufferGeometry()
      lGeo.setAttribute('position', new THREE.BufferAttribute(lp, 3).setUsage(THREE.DynamicDrawUsage))
      const lMat  = new THREE.LineBasicMaterial({ color: 0x0D9488, transparent: true, opacity: 0.18 })
      const lines = new THREE.LineSegments(lGeo, lMat)
      scene.add(lines)

      // ─── Particles ───
      interface P { mesh: THREE.Mesh; ci: number; prog: number; spd: number; dir: 1 | -1 }
      const pGeo = new THREE.SphereGeometry(0.07, 6, 6)
      const pts: P[] = []
      const PC = Math.min(lineCount, 55)
      for (let i = 0; i < PC; i++) {
        const m = new THREE.Mesh(pGeo, new THREE.MeshBasicMaterial({ color: 0x14B8A6, transparent: true, opacity: 0.9 }))
        m.visible = false
        scene.add(m)
        pts.push({ mesh: m, ci: Math.floor(Math.random() * lineCount), prog: Math.random(), spd: 0.005 + Math.random() * 0.012, dir: Math.random() > 0.5 ? 1 : -1 })
      }

      // ─── Pulse Ring ───
      const rGeo  = new THREE.RingGeometry(0.5, 0.62, 32)
      const rMat  = new THREE.MeshBasicMaterial({ color: 0x14B8A6, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
      const rMesh = new THREE.Mesh(rGeo, rMat)
      scene.add(rMesh)
      let rTimer = 0

      // ─── Mouse ───
      const mouse = { x: 0, y: 0 }
      const onMouse = (e: MouseEvent) => {
        const r = container.getBoundingClientRect()
        mouse.x = ((e.clientX - r.left) / r.width  - 0.5)
        mouse.y = -((e.clientY - r.top)  / r.height - 0.5)
      }
      container.addEventListener('mousemove', onMouse, { passive: true })

      // ─── Scroll ───
      let scrollF = 0
      const onScroll = () => { scrollF = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight) }
      window.addEventListener('scroll', onScroll, { passive: true })

      // ─── Resize ───
      const onResize = () => {
        const W2 = container.clientWidth, H2 = container.clientHeight
        camera.aspect = W2 / H2
        camera.updateProjectionMatrix()
        renderer.setSize(W2, H2)
      }
      window.addEventListener('resize', onResize)

      // ─── Animation Loop ───
      const t0 = performance.now()
      let lastT = 0, rotY = 0

      const tick = (t: number) => {
        rafId = requestAnimationFrame(tick)
        const dt    = Math.min((t - lastT) / 1000, 0.05)
        lastT = t
        const elap  = (t - t0) / 1000
        const matPct = Math.min(elap / 2.5, 1)

        // Rotate
        rotY += dt * 0.022
        scene.rotation.y = rotY

        // Camera zoom on scroll
        camera.position.z += ((28 + scrollF * 5.5) - camera.position.z) * 0.05

        // Central node follows mouse
        cTarget.set(mouse.x * 10, mouse.y * 6, 0)
        cCurrent.lerp(cTarget, 0.022)
        cMesh.position.copy(cCurrent)
        cMesh.scale.setScalar(1 + 0.08 * Math.sin(elap * 2.1))
        np[0] = cCurrent.x; np[1] = cCurrent.y; np[2] = cCurrent.z

        // Peripheral nodes
        for (let i = 0; i < NODE_COUNT; i++) {
          const pi = (i + 1) * 3
          np[pi]     += vel[i * 3]
          np[pi + 1] += vel[i * 3 + 1]
          np[pi + 2] += vel[i * 3 + 2]
          if (Math.abs(np[pi])     > 13)  vel[i * 3]     *= -1
          if (Math.abs(np[pi + 1]) > 7.5) vel[i * 3 + 1] *= -1
          if (Math.abs(np[pi + 2]) > 3.5) vel[i * 3 + 2] *= -1
          nodeMeshes[i].position.set(np[pi], np[pi + 1], np[pi + 2])
          const delay = i / NODE_COUNT * 0.6
          const p = Math.max(0, Math.min(1, (matPct - delay) * 2))
          nodeMeshes[i].scale.setScalar(p);
          (nodeMeshes[i].material as THREE.MeshBasicMaterial).opacity = p
        }

        // Lines
        for (let i = 0; i < lineCount; i++) {
          const [a, b] = pairs[i]
          lp[i * 6]     = np[a * 3];     lp[i * 6 + 1] = np[a * 3 + 1]; lp[i * 6 + 2] = np[a * 3 + 2]
          lp[i * 6 + 3] = np[b * 3];     lp[i * 6 + 4] = np[b * 3 + 1]; lp[i * 6 + 5] = np[b * 3 + 2]
        }
        ;(lGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
        lMat.opacity = 0.1 + matPct * 0.12 + Math.sin(elap * 0.8) * 0.02

        // Particles
        for (const p of pts) {
          p.prog += p.spd * p.dir * dt * 18
          if (p.prog >= 1) { p.prog = 1; p.dir = -1 }
          if (p.prog <= 0) { p.prog = 0; p.dir = 1; p.ci = Math.floor(Math.random() * lineCount) }
          const [a, b] = pairs[p.ci]
          const q = p.prog
          p.mesh.position.set(
            np[a * 3]     * (1 - q) + np[b * 3]     * q,
            np[a * 3 + 1] * (1 - q) + np[b * 3 + 1] * q,
            np[a * 3 + 2] * (1 - q) + np[b * 3 + 2] * q,
          )
          p.mesh.visible = matPct > 0.5
        }

        // Pulse ring
        rTimer += dt
        if (rTimer > 2.5) rTimer = 0
        const rp = rTimer / 2.5
        rMesh.position.copy(cCurrent)
        rMesh.scale.setScalar(0.5 + rp * 4.5)
        rMat.opacity = Math.max(0, 0.5 * (1 - rp))

        renderer.render(scene, camera)
      }
      rafId = requestAnimationFrame(tick)

      disposeAll = () => {
        cancelAnimationFrame(rafId)
        container.removeEventListener('mousemove', onMouse)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        renderer.dispose()
        scene.clear()
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      }
    }).catch(() => setWebglFailed(true))

    return () => { disposeAll?.() }
  }, [])

  if (webglFailed) return <FallbackCanvas />

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, background: '#191970' }}
      aria-hidden="true"
    />
  )
}
