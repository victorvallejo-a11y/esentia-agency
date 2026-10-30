'use client'
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { aSuZona, diferencia, nombreZona, type Day, type Slot } from './agendaZona'
import { Arrow, WA_URL, WaIcon } from './ui'

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

const parse = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const fmtDay = (iso: string) => {
  const d = parse(iso)
  return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`
}
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

type Status = 'idle' | 'loading' | 'ready' | 'error'

export default function Agenda() {
  const root = useRef<HTMLElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [days, setDays] = useState<Day[]>([])
  const [day, setDay] = useState<string | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [tz, setTz] = useState('Europe/Madrid')
  const [month, setMonth] = useState<{ y: number; m: number } | null>(null)
  const [step, setStep] = useState(1)
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [errs, setErrs] = useState<Record<string, boolean>>({})
  const [done, setDone] = useState<{ when: string; email: string; name: string; meet?: string } | null>(null)

  const load = useCallback(async (keep = false) => {
    setStatus((s) => (keep && s === 'ready' ? s : 'loading'))
    try {
      const r = await fetch('/api/agenda', { cache: 'no-store' })
      const j = await r.json()
      if (!j.ok || !Array.isArray(j.days)) throw new Error('agenda')
      const zona = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid'
      const ds: Day[] = aSuZona(j.days.filter((d: Day) => d.slots?.length), zona)
      setTz(zona)
      setDays(ds)
      setStatus(ds.length ? 'ready' : 'error')
      if (ds.length) {
        const first = parse(ds[0].date)
        setMonth({ y: first.getFullYear(), m: first.getMonth() })
        setDay(ds[0].date)
        setSlot(null)
      }
    } catch {
      setStatus('error')
    }
  }, [])

  // Solo pedimos huecos cuando la agenda está cerca de verse.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      (en) => {
        if (en[0].isIntersecting) {
          io.disconnect()
          load()
        }
      },
      { rootMargin: '900px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [load])

  const open = useMemo(() => new Map(days.map((d) => [d.date, d])), [days])
  const current = day ? open.get(day) : undefined
  const am = current?.slots.filter((s) => s.t < '14:00') ?? []
  const pm = current?.slots.filter((s) => s.t >= '14:00') ?? []

  const monthsWithDays = useMemo(() => {
    const set = new Set(days.map((d) => d.date.slice(0, 7)))
    return Array.from(set).sort()
  }, [days])

  const grid = useMemo(() => {
    if (!month) return []
    const first = new Date(month.y, month.m, 1)
    const lead = (first.getDay() + 6) % 7
    const total = new Date(month.y, month.m + 1, 0).getDate()
    const cells: (string | null)[] = Array.from({ length: lead }, () => null)
    for (let d = 1; d <= total; d++) cells.push(ymd(new Date(month.y, month.m, d)))
    return cells
  }, [month])

  const monthKey = month ? `${month.y}-${String(month.m + 1).padStart(2, '0')}` : ''
  const mIdx = monthsWithDays.indexOf(monthKey)
  const shiftMonth = (dir: number) => {
    const k = monthsWithDays[mIdx + dir]
    if (!k) return
    const [y, m] = k.split('-').map(Number)
    setMonth({ y, m: m - 1 })
  }

  const todayIso = ymd(new Date())
  // misma hora que en Madrid: se sigue diciendo "Hora de Madrid" y no hace falta aclarar nada
  const fueraDeMadrid = days.some((d) => d.slots.some((s) => s.es !== s.t))
  const zonaTxt = fueraDeMadrid ? nombreZona(tz) : 'Madrid'
  const avisoHora = fueraDeMadrid ? `Ves los horarios en la hora de tu país (${zonaTxt}). ${diferencia(days[0]?.slots[0])}` : 'Horarios en hora de España (Madrid).'

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!slot || !day) return
    const fd = new FormData(e.currentTarget)
    const data = {
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      phone: String(fd.get('phone') || '').trim(),
      dedica: String(fd.get('dedica') || '').trim(),
      objetivo: String(fd.get('objetivo') || '').trim(),
      ig: String(fd.get('ig') || '').trim(),
      webEmpresa: String(fd.get('webEmpresa') || '').trim(),
      decisor: String(fd.get('decisor') || '').trim(),
      website: String(fd.get('website') || ''),
    }
    const bad = {
      name: data.name.length < 2,
      email: !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(data.email),
      dedica: data.dedica.length < 3,
      objetivo: data.objetivo.length < 3,
    }
    setErrs(bad)
    if (bad.name || bad.email || bad.dedica || bad.objetivo) return
    setSending(true)
    setNotice(null)
    try {
      const r = await fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, start: slot.start, tz, ref: document.referrer, q: location.search }),
      })
      const j = await r.json().catch(() => ({ ok: false, error: 'servidor' }))
      if (j.ok) {
        setDone({ when: `${fmtDay(day)} a las ${slot.t}${fueraDeMadrid ? ` (hora de ${zonaTxt})` : ''}`, email: data.email, name: data.name.split(' ')[0], meet: j.meet })
        setStep(3)
        const w = window as unknown as { gtag?: (...a: unknown[]) => void }
        w.gtag?.('event', 'reserva_diagnostico', { slot: slot.start })
      } else if (j.error === 'ocupado') {
        setNotice('Ese hueco se acaba de ocupar. Te he cargado los que quedan libres.')
        setStep(1)
        load(true)
      } else if (j.error === 'datos') {
        setNotice('Revisa el email: no parece válido.')
      } else {
        setNotice('No he podido confirmarla ahora mismo. Escríbeme por WhatsApp y te la cierro yo en un minuto.')
      }
    } catch {
      setNotice('No he podido confirmarla ahora mismo. Escríbeme por WhatsApp y te la cierro yo en un minuto.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="sec agenda-sec" id="agenda" ref={root}>
      <div className="wrap">
        <div className="sec-head rv">
          <h2 className="display">
            Media hora. <em>Sales sabiendo qué atacar primero.</em>
          </h2>
        </div>

        <div className="bz book-shell rv">
          <div className="bz-in book">
            <aside className="book-side">
              <div className="host">
                <img src="/images/victor.webp" alt="Víctor Vallejo" width={56} height={56} loading="lazy" />
                <div>
                  <b>Víctor Vallejo</b>
                  <small>Fundador · te atiendo yo</small>
                </div>
              </div>
              <h3>Sesión de diagnóstico</h3>
              <ul className="meta">
                <li>
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>30 minutos · gratis
                </li>
                <li>
                  <svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="13" height="12" rx="2.5" /><path d="M15.5 11l6-3.5v9l-6-3.5z" /></svg>Videollamada (Google Meet)
                </li>
                <li>
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" /></svg>Hora de {zonaTxt}
                </li>
              </ul>
              {slot && day && step < 3 && (
                <p className="chosen">
                  <b>{slot.t}</b> · {fmtDay(day)}
                </p>
              )}
              <p className="book-note">Vemos tu negocio, no una presentación.</p>
              <ol className="stp">
                {['Cuándo', 'Tus datos', 'Confirmado'].map((s, i) => (
                  <li key={s} data-on={step >= i + 1 ? '1' : '0'}>
                    <i>0{i + 1}</i>
                    {s}
                  </li>
                ))}
              </ol>
            </aside>

            <div className="book-main">
              {notice && (
                <p className="notice" role="status">
                  {notice}
                  {!notice.startsWith('Ese hueco') && !notice.startsWith('Revisa') && (
                    <a href={WA_URL} target="_blank" rel="noopener">Abrir WhatsApp</a>
                  )}
                </p>
              )}
              <div className="track" style={{ transform: `translateX(${-(step - 1) * 33.3333}%)` }}>
                {/* 01 · Cuándo */}
                <div className="step-pane" aria-hidden={step !== 1}>
                  {status === 'error' ? (
                    <div className="cal-err">
                      <p>
                        <b>No puedo cargar la agenda ahora mismo.</b> Escríbeme y te doy hueco hoy mismo.
                      </p>
                      <a className="eb eb-primary" href={WA_URL} target="_blank" rel="noopener" tabIndex={step === 1 ? 0 : -1}>
                        <span className="eb-t">Escribir por WhatsApp</span>
                        <span className="eb-i"><WaIcon /></span>
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className="cal-h">
                        <p>{month ? `${MESES[month.m]} ${month.y}` : 'Cargando agenda…'}</p>
                        {monthsWithDays.length > 1 && (
                          <div className="cal-nav">
                            <button type="button" aria-label="Mes anterior" disabled={mIdx <= 0} onClick={() => shiftMonth(-1)} tabIndex={step === 1 ? 0 : -1}>
                              ‹
                            </button>
                            <button type="button" aria-label="Mes siguiente" disabled={mIdx >= monthsWithDays.length - 1} onClick={() => shiftMonth(1)} tabIndex={step === 1 ? 0 : -1}>
                              ›
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="dow" aria-hidden="true">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                          <span key={d}>{d}</span>
                        ))}
                      </div>
                      <div className={`cal-grid${status !== 'ready' ? ' loading' : ''}`}>
                        {status !== 'ready'
                          ? Array.from({ length: 35 }).map((_, i) => <span key={i} className="day sk" />)
                          : grid.map((iso, i) =>
                              iso === null ? (
                                <span key={`b${i}`} className="day blank" />
                              ) : open.has(iso) ? (
                                <button
                                  key={iso}
                                  type="button"
                                  className="day"
                                  data-free="1"
                                  aria-pressed={iso === day}
                                  aria-label={fmtDay(iso)}
                                  tabIndex={step === 1 ? 0 : -1}
                                  onClick={() => {
                                    setDay(iso)
                                    setSlot(null)
                                  }}
                                >
                                  {parse(iso).getDate()}
                                </button>
                              ) : (
                                <span key={iso} className={`day${iso === todayIso ? ' today' : ''}`} aria-hidden="true">
                                  {parse(iso).getDate()}
                                </span>
                              ),
                            )}
                      </div>
                      <p className="cal-note">
                        Abro los cinco próximos días laborables. ¿No te va bien ninguno?{' '}
                        <a href={WA_URL} target="_blank" rel="noopener" tabIndex={step === 1 ? 0 : -1}>Escríbeme y lo cuadramos</a>.
                      </p>
                      {status === 'ready' && day && (
                        <div className="slots-wrap">
                          <p className="slot-day">{fmtDay(day)}</p>
                          <p className="tz-note">{avisoHora}</p>
                          {[['Mañana', am], ['Tarde', pm]].map(([lab, list]) =>
                            (list as Slot[]).length ? (
                              <div className="slot-blk" key={lab as string}>
                                <p>{lab as string}</p>
                                <div className="slots">
                                  {(list as Slot[]).map((s) => (
                                    <button
                                      key={s.start}
                                      type="button"
                                      className="slot"
                                      aria-pressed={slot?.start === s.start}
                                      tabIndex={step === 1 ? 0 : -1}
                                      onClick={() => setSlot(s)}
                                    >
                                      {s.t}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : null,
                          )}
                        </div>
                      )}
                      <div className="pane-foot">
                        <button
                          type="button"
                          className="eb eb-primary"
                          disabled={!slot}
                          tabIndex={step === 1 ? 0 : -1}
                          onClick={() => {
                            setNotice(null)
                            setStep(2)
                            setTimeout(() => (document.getElementById('f-name') as HTMLInputElement | null)?.focus({ preventScroll: true }), 650)
                          }}
                        >
                          <span className="eb-t">Continuar</span>
                          <span className="eb-i" aria-hidden="true"><Arrow /></span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* 02 · Tus datos */}
                <div className="step-pane" aria-hidden={step !== 2}>
                  <form onSubmit={submit} noValidate>
                    {slot && day && (
                      <p className="sum">
                        <b>{slot.t}</b> · {fmtDay(day)} · 30 min · videollamada
                        {fueraDeMadrid && ` · hora de ${zonaTxt} (en España, las ${slot.es})`}
                      </p>
                    )}
                    <div className="form">
                      <label>
                        Nombre
                        <input id="f-name" name="name" type="text" autoComplete="name" className={errs.name ? 'err' : ''} tabIndex={step === 2 ? 0 : -1} />
                      </label>
                      <label>
                        Email
                        <input name="email" type="email" autoComplete="email" inputMode="email" className={errs.email ? 'err' : ''} tabIndex={step === 2 ? 0 : -1} />
                      </label>
                      <label>
                        <span>Teléfono <em>· opcional</em></span>
                        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" tabIndex={step === 2 ? 0 : -1} />
                      </label>
                      <label>
                        <span>Instagram <em>· opcional</em></span>
                        <input name="ig" type="text" autoComplete="off" placeholder="Tu usuario" tabIndex={step === 2 ? 0 : -1} />
                      </label>
                      <input className="hp" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                      <label className="wide">
                        ¿A qué se dedica tu empresa y cuántas personas trabajan en ella?
                        <input name="dedica" type="text" className={errs.dedica ? 'err' : ''} tabIndex={step === 2 ? 0 : -1} />
                      </label>
                      <label className="wide">
                        ¿Qué te gustaría conseguir con la llamada?
                        <input name="objetivo" type="text" className={errs.objetivo ? 'err' : ''} tabIndex={step === 2 ? 0 : -1} />
                      </label>
                      <label className="wide">
                        <span>¿Cuál es la web o el Instagram de tu empresa? <em>· opcional</em></span>
                        <input name="webEmpresa" type="text" tabIndex={step === 2 ? 0 : -1} />
                      </label>
                      <label className="wide">
                        <span>¿Decides tú o hay alguien más que deba estar en la llamada? <em>· opcional</em></span>
                        <input name="decisor" type="text" tabIndex={step === 2 ? 0 : -1} />
                      </label>
                    </div>
                    <p className="legal">
                      Al confirmar aceptas que use tus datos solo para esta reunión. <a href="/privacidad">Privacidad</a>
                    </p>
                    <div className="pane-foot">
                      <button type="button" className="eb eb-ghost eb-back" onClick={() => setStep(1)} tabIndex={step === 2 ? 0 : -1}>
                        <span className="eb-t">Atrás</span>
                      </button>
                      <button type="submit" className="eb eb-primary" disabled={sending} tabIndex={step === 2 ? 0 : -1}>
                        <span className="eb-t">{sending ? 'Confirmando…' : 'Confirmar sesión'}</span>
                        <span className={`eb-i${sending ? ' spin' : ''}`} aria-hidden="true">
                          <Arrow />
                        </span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* 03 · Confirmado */}
                <div className="step-pane" aria-hidden={step !== 3}>
                  <div className={`done${step === 3 ? ' go' : ''}`}>
                    <div className="tick">
                      <svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" /></svg>
                    </div>
                    <h4>Sesión confirmada</h4>
                    {done && (
                      <p>
                        {done.name}, nos vemos el <b>{done.when}</b>. Te he enviado la invitación con el enlace de Google Meet a <b>{done.email}</b>.
                      </p>
                    )}
                    <div className="acts">
                      {done?.meet && (
                        <a className="eb eb-ghost" href={done.meet} target="_blank" rel="noopener" tabIndex={step === 3 ? 0 : -1}>
                          <span className="eb-t">Abrir enlace de Meet</span>
                        </a>
                      )}
                      <a className="eb eb-ghost" href={WA_URL} target="_blank" rel="noopener" tabIndex={step === 3 ? 0 : -1}>
                        <span className="eb-t">¿Algo antes? WhatsApp</span>
                        <span className="eb-i" aria-hidden="true"><WaIcon /></span>
                      </a>
                    </div>
                    <p className="fine">Si te surge algo, responde a la invitación y lo movemos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
