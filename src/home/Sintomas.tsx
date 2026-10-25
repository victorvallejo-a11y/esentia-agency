'use client'
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

type Item = { q: string; title: string; tag: string; lead: ReactNode; ui: ReactNode }

const ITEMS: Item[] = [
  {
    q: '“Cuando llamo al propietario, ya ha firmado con otro.”',
    title: 'Captación de propietarios',
    tag: 'inmobiliarias',
    lead: (
      <>
        <b>El propietario que pide valoración, atendido en un minuto.</b> Y con la cita ya en tu agenda.
      </>
    ),
    ui: (
      <div className="ui cap">
        <h6>Valoraciones pedidas · hoy</h6>
        {[
          ['Piso · Terrassa · 3 hab · 92 m²', 'mar 10:00', 'hace 2 h'],
          ['Ático · Sabadell · 2 hab · 70 m²', 'mié 12:30', 'hace 5 h'],
          ['Casa · Rubí · 4 hab · 160 m²', 'jue 17:00', 'ayer'],
        ].map(([a, b, c], i) => (
          <div className={`cap-r r${i}`} key={a}>
            <span className="cap-a">{a}<small>{c} · atendido ✓</small></span>
            <b>{b}</b>
          </div>
        ))}
        <div className="cap-wa">
          <small>WhatsApp al propietario</small>
          <p>Hola Marta, gracias por pedir la valoración. Te confirmo la visita a tu piso de Terrassa el martes a las 10:00…</p>
        </div>
      </div>
    ),
  },
  {
    q: '“Los pedidos me llegan por WhatsApp y audios.”',
    title: 'Pedidos',
    tag: 'distribución',
    lead: (
      <>
        <b>Audios y mensajes convertidos en pedidos.</b> Listos para el reparto.
      </>
    ),
    ui: (
      <div className="ui ped2">
        <div className="ped2-a">
          <span className="play" />
          <span className="wave">
            {Array.from({ length: 22 }).map((_, i) => (
              <i key={i} style={{ height: `${5 + ((i * 7) % 16)}px` }} />
            ))}
          </span>
          <small>0:14 · Bar Rius</small>
        </div>
        <div className="ped2-l">
          <h6>Pedido #2214 · ruta 2</h6>
          {['12 kg tomate pera', '6 cajas lechuga iceberg', '4 garrafas aceite 5 l'].map((t, i) => (
            <div className={`pl l${i}`} key={t}>
              <i />
              {t}
            </div>
          ))}
          <span className="okp">Confirmado al cliente ✓</span>
        </div>
      </div>
    ),
  },
  {
    q: '“Me paso las tardes con facturas.”',
    title: 'Facturas y gestoría',
    tag: 'administración',
    lead: (
      <>
        <b>Las facturas se leen solas.</b> Y llegan cuadradas a tu gestoría.
      </>
    ),
    ui: (
      <div className="ui fac2">
        <div className="inv2">
          <b>FACTURA</b>
          <small>Harinas Molí · 0412</small>
          <i /><i /><i />
          <em>453,20 €</em>
          <span className="scan" />
        </div>
        <div className="flds">
          <div className="fl"><small>Proveedor</small><b>Harinas Molí</b></div>
          <div className="fl"><small>Base</small><b>412,00 €</b></div>
          <div className="fl"><small>IVA 10 %</small><b>41,20 €</b></div>
          <div className="go"><span>Enviada a gestoría ✓</span></div>
        </div>
      </div>
    ),
  },
  {
    q: '“Se me escapan llamadas.”',
    title: 'Asistente de voz',
    tag: 'teléfono',
    lead: (
      <>
        <b>Coge el teléfono cuando tú no puedes.</b> Y te deja el resumen.
      </>
    ),
    ui: (
      <div className="ui voz">
        <div className="voz-c">
          <span className="voz-av">
            <i />
          </span>
          <div>
            <b>Llamada entrante</b>
            <small>+34 6•• ••• •12 · 19:42</small>
          </div>
          <span className="voz-t">01:36</span>
        </div>
        <div className="voz-w">
          {Array.from({ length: 34 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${(i % 9) * -0.13}s` }} />
          ))}
        </div>
        <div className="voz-s">
          <small>Resumen</small>
          <p>Quiere vender un 3 habitaciones en Terrassa. Visita agendada: jueves 11:00.</p>
        </div>
      </div>
    ),
  },
  {
    q: '“Los presupuestos se quedan sin respuesta.”',
    title: 'Seguimiento comercial',
    tag: 'ventas',
    lead: (
      <>
        <b>El seguimiento sale solo.</b> Tú solo cierras.
      </>
    ),
    ui: (
      <div className="ui crm2">
        <div className="board2">
          <div className="col"><h6>Nuevo</h6><span className="sp" /><span className="cd">Cafetería Rius<small>420 €</small></span></div>
          <div className="col"><h6>Propuesta</h6><span className="sp" /><span className="cd">Hotel Sitges<small>900 €</small></span></div>
          <div className="col"><h6>Cerrado</h6><span className="sp" /><span className="cd">Colegio Sants<small>2.100 €</small></span></div>
          <div className="mv">Restaurante Nou<small>1.850 €</small></div>
        </div>
        <div className="st"><span className="s1">Seguimiento enviado solo · día 3</span><span className="s2">Cerrado · 1.850 €</span></div>
      </div>
    ),
  },
  {
    q: '“Contestamos lo mismo cincuenta veces al día.”',
    title: 'Atención al cliente',
    tag: 'una pieza más',
    lead: (
      <>
        <b>Resuelve lo repetido.</b> A ti solo te llega lo importante.
      </>
    ),
    ui: (
      <div className="ui chat2">
        <div className="bub in b1">¿Hacéis reparto el sábado por la mañana?<small>21:14</small></div>
        <div className="typing"><i /><i /><i /></div>
        <div className="bub out b2">Sí, de 8:00 a 13:00. ¿Te lo apunto para este sábado?<small>21:14 ✓✓</small></div>
        <span className="stamp">Resuelto sin interrumpirte</span>
      </div>
    ),
  },
]

export default function Sintomas() {
  const [cur, setCur] = useState(0)
  const [auto, setAuto] = useState(true)
  const [hold, setHold] = useState(false)
  const [off, setOff] = useState(true)
  const root = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) setAuto(false)
    const io = new IntersectionObserver((en) => setOff(!en[0].isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const show = (i: number, user = false) => {
    if (user) setAuto(false)
    setCur(i)
    const l = list.current, t = tabs.current[i]
    if (l && t && window.innerWidth <= 860) l.scrollTo({ left: t.offsetLeft - 20, behavior: 'smooth' })
  }

  const onKey = (e: KeyboardEvent) => {
    const fw = e.key === 'ArrowDown' || e.key === 'ArrowRight'
    const bw = e.key === 'ArrowUp' || e.key === 'ArrowLeft'
    if (!fw && !bw) return
    e.preventDefault()
    const n = (cur + (fw ? 1 : ITEMS.length - 1)) % ITEMS.length
    show(n, true)
    tabs.current[n]?.focus()
  }

  return (
    <section className="sec sx-sec" id="ejemplos">
      <div className="wrap">
        <div className="sec-head rv">
          <h2 className="display">
            Tú nos cuentas qué te frena. <em>Nosotros diseñamos lo que lo quita.</em>
          </h2>
        </div>
        <div
          ref={root}
          className={`sx rv${auto ? ' auto' : ''}${hold ? ' hold' : ''}${off ? ' off' : ''}`}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHold(true)}
          onPointerLeave={() => setHold(false)}
        >
          <div className="sx-list" role="tablist" aria-label="Qué te frena" ref={list} onKeyDown={onKey}>
            {ITEMS.map((it, i) => (
              <button
                key={it.q}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                className="sx-q"
                type="button"
                role="tab"
                id={`sx-t${i}`}
                aria-controls={`sx-p${i}`}
                aria-selected={i === cur}
                tabIndex={i === cur ? 0 : -1}
                onClick={() => show(i, true)}
                onAnimationEnd={(e) => {
                  if (e.animationName === 'sxBar' && auto && i === cur) show((cur + 1) % ITEMS.length)
                }}
              >
                <i>{String(i + 1).padStart(2, '0')}</i>
                <span>{it.q}</span>
              </button>
            ))}
          </div>

          <div className="bz">
            <div className="bz-in sx-panel" data-tilt>
              {ITEMS.map((it, i) => (
                <div
                  key={it.title}
                  className={`sx-p${i === cur ? ' on' : ''}`}
                  role="tabpanel"
                  id={`sx-p${i}`}
                  aria-labelledby={`sx-t${i}`}
                  aria-hidden={i !== cur}
                >
                  <div className="sx-h">
                    <h3>{it.title}</h3>
                    <span className="tag">{it.tag}</span>
                  </div>
                  <p>{it.lead}</p>
                  {it.ui}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="sx-foot rv">
          ¿No ves el tuyo? <a href="#agenda">Lo buscamos juntos</a>
        </p>
      </div>
    </section>
  )
}
