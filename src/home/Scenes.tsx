'use client'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fmtN } from './ui'

const SVGNS = 'http://www.w3.org/2000/svg'

/* Conexiones del sistema: una curva del núcleo a cada módulo. Se calculan
   con las posiciones reales del CSS, así sirven igual en escritorio y móvil. */
function buildWires(board: HTMLElement) {
  const svg = board.querySelector('svg.wires') as SVGSVGElement
  const hub = board.querySelector('.hub') as HTMLElement
  const ic = board.querySelector('.hub-ic') as HTMLElement
  if (!svg || !hub || !ic) return
  svg.setAttribute('viewBox', `0 0 ${board.offsetWidth} ${board.offsetHeight}`)
  const hx = hub.offsetLeft + hub.offsetWidth / 2, hy = hub.offsetTop + ic.offsetTop + ic.offsetHeight / 2
  board.querySelectorAll<HTMLElement>('.mod').forEach((m, i) => {
    const card = (m.firstElementChild as HTMLElement) || m
    const mx = m.offsetLeft + card.offsetLeft + card.offsetWidth / 2
    const my = m.offsetTop + card.offsetTop + card.offsetHeight / 2
    const horizontal = Math.abs(mx - hx) > Math.abs(my - hy)
    const d = horizontal
      ? `M${hx} ${hy} C${(hx + mx) / 2} ${hy} ${(hx + mx) / 2} ${my} ${mx} ${my}`
      : `M${hx} ${hy} C${hx} ${(hy + my) / 2} ${mx} ${(hy + my) / 2} ${mx} ${my}`
    // Se reutilizan los trazos ya creados: las animaciones de GSAP apuntan a ellos.
    for (const cls of ['w', 'p']) {
      let p = svg.querySelector(`path.${cls}[data-i="${i}"]`) as SVGPathElement | null
      if (!p) {
        p = document.createElementNS(SVGNS, 'path')
        p.setAttribute('pathLength', '100')
        p.setAttribute('class', cls)
        p.setAttribute('data-i', String(i))
        if (cls === 'p') p.style.animationDelay = `${(i * 0.37) % 2.2}s`
        svg.insertBefore(p, svg.firstChild)
      }
      p.setAttribute('d', m.offsetParent ? d : '')
    }
  })
}

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export default function Scenes() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ ignoreMobileResize: true })
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 861
    const smooth = mobile ? 0.35 : 1
    const board = document.querySelector('.board') as HTMLElement | null
    if (board) buildWires(board)
    const rebuild = () => board && buildWires(board)
    ScrollTrigger.addEventListener('refreshInit', rebuild)

    const sys = document.querySelector('.sys') as HTMLElement | null
    const stage = document.querySelector('.sys-stage') as HTMLElement | null
    const chat = document.querySelector('.mod-chat') as HTMLElement | null
    // Encaje del tablero entero en el escenario, y encuadre pegado al chat.
    const fit = () => {
      const sw = stage!.clientWidth, sh = stage!.clientHeight, bw = board!.offsetWidth, bh = board!.offsetHeight
      const s = Math.min((sw * 0.97) / bw, (sh * 0.96) / bh)
      return { s, x: (sw - bw * s) / 2, y: (sh - bh * s) / 2 }
    }
    const focus = () => {
      const sw = stage!.clientWidth, sh = stage!.clientHeight, cw = chat!.offsetWidth, ch = chat!.offsetHeight
      const s = Math.min((sh * 0.9) / ch, (sw * 0.86) / cw)
      const cx = chat!.offsetLeft + cw / 2, cy = chat!.offsetTop + ch / 2
      return { s, x: sw / 2 - cx * s, y: sh / 2 - cy * s }
    }

    const ctx = gsap.context(() => {
      /* Nav oscura mientras pasa por el acto oscuro (clase en <html>: React reescribe la de la barra) */
      ScrollTrigger.create({ trigger: '.act', start: 'top 44px', end: 'bottom 44px', toggleClass: { targets: document.documentElement, className: 'nav-dark' }, refreshPriority: -1 })

      if (reduced) {
        document.documentElement.classList.add('rm')
        if (board && stage) {
          const f = fit()
          gsap.set(board, { transformOrigin: '0 0', x: f.x, y: f.y, scale: f.s })
        }
        return
      }

      /* Entradas suaves */
      gsap.utils.toArray<HTMLElement>('.rv').forEach((el) => {
        gsap.from(el, { opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true, refreshPriority: -1 } })
      })

      /* El dato: nace vivo, se queda y se va con el scroll (no de golpe) */
      const words = gsap.utils.toArray<HTMLElement>('.dato-line .w')
      const num = document.querySelector('.dato-line .num') as HTMLElement | null
      const counter = { v: 0 }
      gsap.set(words, { opacity: 0, y: 18, filter: mobile ? 'none' : 'blur(6px)' })
      gsap.set(['.dato-sub', '.dato-src'], { opacity: 0, y: 12 })
      gsap
        .timeline({ scrollTrigger: { trigger: '.dato', start: 'top top', end: 'bottom bottom', scrub: smooth } })
        .to('.dato-glow', { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0)
        .fromTo('.dato-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.12 }, 0)
        .to(words, { opacity: 1, y: 0, filter: mobile ? 'none' : 'blur(0px)', duration: 0.18, stagger: 0.035, ease: 'power2.out' }, 0.03)
        .to(counter, { v: 94, duration: 0.34, ease: 'none', onUpdate: () => { if (num) num.textContent = `${Math.round(counter.v)}%` } }, 0.05)
        .to('.dato-line .q', { color: '#3CCFBB', duration: 0.12 }, 0.5)
        .to(['.dato-sub', '.dato-src'], { opacity: 1, y: 0, duration: 0.16, stagger: 0.04 }, 0.58)
        .to({}, { duration: 0.7 })
        .to(words, { opacity: 0, y: -40, filter: mobile ? 'none' : 'blur(6px)', duration: 0.55, ease: 'none', stagger: 0.02 }, '>')
        .to(['.dato-sub', '.dato-src', '.dato-rule'], { opacity: 0, y: -30, duration: 0.5, ease: 'none' }, '<')
        .to('.dato-glow', { opacity: 0, scale: 1.25, duration: 0.6, ease: 'none' }, '<')

      /* Qué hacemos: la cámara se aleja del chat y aparece la máquina entera */
      if (sys && stage && chat && board) {
        const others = gsap.utils.toArray<HTMLElement>('.mod:not(.mod-chat)')
        const sts = gsap.utils.toArray<HTMLElement>('.sys-st')
        gsap.set(board, { transformOrigin: '0 0' })
        gsap.set(others, { opacity: 0, scale: 0.9 })
        gsap.set('.hub', { opacity: 0, scale: 0.8 })
        gsap.set([sts[1], sts[2]], { opacity: 0, y: 26 })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sys,
            start: 'top top',
            end: 'bottom bottom',
            scrub: smooth,
            invalidateOnRefresh: true,
            onUpdate: (s) => sys.classList.toggle('live', s.progress > 0.6),
          },
        })
        tl.fromTo(
          board,
          { x: () => focus().x, y: () => focus().y, scale: () => focus().s },
          { x: () => fit().x, y: () => fit().y, scale: () => fit().s, duration: 1, ease: 'power2.inOut' },
          0.16,
        )
          .to('.mod-chat', { '--glow': 0, duration: 0.2 }, 0.2)
          .to(others, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out' }, 0.42)
          .to('.hub', { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(1.6)' }, 0.62)
          .fromTo('.wires .w', { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.3, stagger: 0.03, ease: 'none' }, 0.66)
          .to(sts[0], { opacity: 0, y: -22, duration: 0.12 }, 0.3)
          .to(sts[1], { opacity: 1, y: 0, duration: 0.16 }, 0.44)
          .to(sts[1], { opacity: 0, y: -22, duration: 0.12 }, 1.22)
          .to(sts[2], { opacity: 1, y: 0, duration: 0.16 }, 1.32)
          .to({}, { duration: 0.32 })
      }

      /* Amanecer: del negro se sale con una cúpula crema que sube y se aplana */
      gsap.fromTo(
        '.dawn-edge',
        { scaleY: 1, scaleX: 0.86 },
        { scaleY: 0, scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.sheet', start: 'top bottom', end: 'top 25%', scrub: true } },
      )
      gsap.fromTo('.act-sun', { opacity: 0, yPercent: 30 }, { opacity: 1, yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.sheet', start: 'top bottom', end: 'top 40%', scrub: true } })

      /* Cifras del caso */
      ScrollTrigger.create({
        trigger: '#stats',
        start: 'top 92%',
        once: true,
        refreshPriority: -1,
        onEnter: () => {
          document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
            const o = { v: 0 }, end = Number(el.dataset.count)
            gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = fmtN(o.v) } })
          })
        },
      })
    })

    /* Caso: el iPhone entra girando y la conversación avanza con el scroll */
    const mm = gsap.matchMedia()
    if (!reduced && document.querySelector('.case-ph')) {
      mm.add({ desk: '(min-width: 861px)', mob: '(max-width: 860px)' }, (c) => {
        const desk = !!c.conditions?.desk
        const zone = desk ? '.case-sec' : '.case-stage-wrap'
        const smoothC = desk ? 0.8 : 0.35
        const ph = document.querySelector('.case-ph') as HTMLElement
        const tilt = document.querySelector('.ph-tilt') as HTMLElement
        const body = ph.querySelector('.wa-body') as HTMLElement
        const list = ph.querySelector('.wa-list') as HTMLElement
        const rows = gsap.utils.toArray<HTMLElement>('.case-ph .wa-list .k')
        const sides = gsap.utils.toArray<HTMLElement>('.case-stage .side')
        const onl = ph.querySelector('.onl'), typ = ph.querySelector('.typ')
        // Sube la lista lo justo para que se vea entero lo último que ha aparecido.
        const lift = (el: HTMLElement, h?: () => number) => () =>
          Math.min(0, body.clientHeight * 0.97 - (el.offsetTop + (h ? h() : el.offsetHeight)))

        gsap.fromTo(
          '.ph-persp',
          { opacity: 0 },
          { opacity: 1, ease: 'none', scrollTrigger: { trigger: zone, start: 'top 85%', end: 'top 55%', scrub: true } },
        )
        gsap
          .timeline({ scrollTrigger: { trigger: zone, start: 'top 85%', end: 'top top', scrub: smoothC, invalidateOnRefresh: true } })
          .fromTo(
            ph,
            { rotateY: -400, rotateX: 22, rotateZ: -18, x: desk ? 220 : 0, y: desk ? 160 : 220, scale: 0.58 },
            { rotateY: -18, rotateX: 8, rotateZ: 3, x: 0, y: 0, scale: 1, ease: 'power3.out', duration: 1 },
            0,
          )
          .fromTo(ph.querySelector('.ph-glare'), { '--gx': '0%' }, { '--gx': '100%', ease: 'none', duration: 1 }, 0)
          .fromTo('.ph-shadow', { opacity: 0, scaleX: 0.3 }, { opacity: 1, scaleX: 1, ease: 'power3.out', duration: 1 }, 0)

        gsap.set(rows, { opacity: 0 })
        rows.forEach((r) => {
          const b = r.querySelector('.wb')
          if (r.querySelector('.wty') && b) gsap.set(b, { opacity: 0 })
        })
        gsap.set(sides, { opacity: 0 })

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: { trigger: zone, start: 'top top', end: 'bottom bottom', scrub: smoothC, invalidateOnRefresh: true },
        })
        // Un leve giro mientras se lee, para que no se quede muerto.
        tl.fromTo(tilt, { rotateY: 0, rotateX: 0 }, { rotateY: 8, rotateX: -2, duration: 6.6, ease: 'none' }, 0)
        let t = 0.25
        const say = (i: number) => {
          tl.fromTo(rows[i], { opacity: 0, y: 14, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.35 }, t)
          tl.to(list, { y: lift(rows[i]), duration: 0.4 }, t)
          t += 0.6
        }
        const reply = (i: number, typing = true) => {
          const ty = rows[i].querySelector('.wty') as HTMLElement | null
          const b = rows[i].querySelector('.wb') as HTMLElement
          if (typing && ty) {
            tl.set(rows[i], { opacity: 1 }, t)
            tl.fromTo(ty, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.2 }, t)
            tl.to(onl, { opacity: 0, duration: 0.1 }, t).to(typ, { opacity: 1, duration: 0.1 }, t)
            tl.to(list, { y: lift(rows[i], () => ty.offsetHeight), duration: 0.3 }, t)
            t += 0.55
            tl.to(ty, { opacity: 0, scale: 0.8, duration: 0.12 }, t)
            tl.to(typ, { opacity: 0, duration: 0.1 }, t).to(onl, { opacity: 1, duration: 0.1 }, t)
            tl.fromTo(b, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.3 }, t)
            tl.to(list, { y: lift(rows[i]), duration: 0.35 }, t)
          } else {
            tl.fromTo(rows[i], { opacity: 0, y: 14, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.35 }, t)
            tl.to(list, { y: lift(rows[i]), duration: 0.4 }, t)
          }
          t += 0.6
        }
        const pop = (s: HTMLElement, at: number, hideAt?: number) => {
          const left = s.classList.contains('s1') || s.classList.contains('s3')
          tl.fromTo(
            s,
            { opacity: 0, x: desk ? (left ? 50 : -50) : 0, y: desk ? 0 : 24, scale: 0.9 },
            { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.5)' },
            at,
          )
          if (hideAt !== undefined) tl.to(s, { opacity: 0, y: desk ? 0 : -10, duration: 0.2 }, hideAt)
        }

        say(0)
        reply(1)
        say(2)
        reply(3)
        const card = t
        reply(4, false)
        say(5)
        const end = t
        tl.fromTo(ph.querySelector('.ios-ban'), { opacity: 0, y: '-120%' }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.3)' }, end)
        if (desk) {
          pop(sides[0], card - 0.5)
          pop(sides[1], card - 0.25)
          pop(sides[2], end - 0.55)
          pop(sides[3], end + 0.1)
        } else {
          pop(sides[0], card - 0.5, card - 0.05)
          pop(sides[1], card, end - 0.65)
          pop(sides[2], end - 0.55, end + 0.05)
          pop(sides[3], end + 0.1)
        }
        tl.to({}, { duration: 0.8 }, end + 0.4)
      })
    }

    /* Cómo trabajamos: recorrido horizontal con las fases montándose solas */
    const how = document.querySelector('.how') as HTMLElement | null
    const hctx = gsap.context(() => {
      if (!how || reduced) return
      const track = how.querySelector('.how-track') as HTMLElement
      const panels = gsap.utils.toArray<HTMLElement>('.how .phs')
      const bars = gsap.utils.toArray<HTMLElement>('.how-prog b')
      const lis = gsap.utils.toArray<HTMLElement>('.how-prog li')
      const n = panels.length
      const dist = () => {
        const last = panels[n - 1]
        return Math.max(0, last.offsetLeft + last.offsetWidth + panels[0].offsetLeft - track.clientWidth)
      }
      const paint = (p: number) => {
        const c = p * (n - 1)
        bars.forEach((b, i) => gsap.set(b, { scaleX: gsap.utils.clamp(0, 1, c - i + 1) }))
        lis.forEach((li, i) => li.classList.toggle('on', c >= i - 0.5))
      }
      paint(0)
      const size = () => { how.style.height = `${window.innerHeight + dist() * 1.2}px` }
      size()
      ScrollTrigger.addEventListener('refreshInit', size)
      const h = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: how,
          start: 'top top',
          end: 'bottom bottom',
          scrub: smooth,
          invalidateOnRefresh: true,
          onUpdate: (s) => paint(s.progress),
        },
      })
      const inPanel = (el: HTMLElement) => ({ trigger: el, containerAnimation: h, start: 'left 78%', end: 'center 52%', scrub: true })

      // 01 · el mapa del proceso se dibuja mientras la sección entra y se marca el atasco
      const call = { v: 0 }
      const callT = how.querySelector('.call-t') as HTMLElement
      const neck = how.querySelector('.fs.neck') as HTMLElement
      gsap
        .timeline({ scrollTrigger: { trigger: how, start: 'top 75%', end: 'top 2%', scrub: true, onUpdate: (s) => neck.classList.toggle('hot', s.progress > 0.75) } })
        .to(call, { v: 1470, duration: 1, ease: 'none', onUpdate: () => { callT.textContent = mmss(call.v) } }, 0)
        .from('.sess', { opacity: 0, y: -14, duration: 0.2 }, 0)
        .from('.flow .fs', { opacity: 0, y: 22, duration: 0.2, stagger: 0.12 }, 0.1)
        .to(neck, { backgroundColor: '#fff4e3', duration: 0.15 }, 0.7)
        .to('.neck-l', { opacity: 1, duration: 0.12 }, 0.72)

      // 02 · la propuesta se monta y se firma
      gsap
        .timeline({ scrollTrigger: inPanel(panels[1]) })
        .from(panels[1].querySelectorAll('.pd-s'), { opacity: 0, y: 18, duration: 0.25, stagger: 0.12 }, 0)
        .to(panels[1].querySelectorAll('.cmp b'), { scaleX: 1, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, 0.25)
        .to(panels[1].querySelector('.sig path'), { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, 0.5)
        .to(panels[1].querySelector('.pd-ok'), { opacity: 1, duration: 0.12 }, 0.8)
        .fromTo(panels[1].querySelector('.mail'), { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.2, ease: 'back.out(1.4)' }, 0.86)

      // 03 · se conecta todo, se prueba y queda en marcha
      const set = gsap.timeline({ scrollTrigger: { ...inPanel(panels[2]), invalidateOnRefresh: true } })
      panels[2].querySelectorAll<HTMLElement>('.tg').forEach((tg, i) => {
        const k = tg.querySelector('i') as HTMLElement
        set.to(tg, { backgroundColor: '#34c759', duration: 0.1 }, i * 0.13)
        set.to(k, { x: () => tg.offsetWidth - k.offsetWidth - 2 * k.offsetLeft, duration: 0.1, ease: 'power2.out' }, i * 0.13)
      })
      const tests = { v: 0 }
      const cnt = panels[2].querySelector('.set-c') as HTMLElement
      set
        .to(tests, { v: 20, duration: 0.3, ease: 'none', onUpdate: () => { cnt.textContent = `${Math.round(tests.v)}/20` } }, 0.62)
        .to(panels[2].querySelector('.set-ok'), { opacity: 1, duration: 0.1 }, 0.92)

      // 04 · el informe del mes y el siguiente cuello de botella
      const hrs = { v: 0 }
      const repC = panels[3].querySelector('.rep-c') as HTMLElement
      gsap
        .timeline({ scrollTrigger: inPanel(panels[3]) })
        .to(hrs, { v: 46, duration: 0.5, ease: 'power1.out', onUpdate: () => { repC.textContent = String(Math.round(hrs.v)) } }, 0)
        .to(panels[3].querySelectorAll('.rep-ch i'), { scaleY: 1, duration: 0.3, stagger: 0.06, ease: 'power2.out' }, 0)
        .fromTo(panels[3].querySelector('.next'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.25, ease: 'back.out(1.4)' }, 0.7)
    })

    // Las fuentes cambian medidas: recalcular cuando estén listas.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      window.removeEventListener('load', onLoad)
      ScrollTrigger.removeEventListener('refreshInit', rebuild)
      how?.style.removeProperty('height')
      mm.revert()
      hctx.revert()
      ctx.revert()
    }
  }, [])
  return null
}
