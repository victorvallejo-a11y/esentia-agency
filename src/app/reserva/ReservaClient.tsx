'use client'
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { aSuZona, diferencia, nombreZona, type Day, type Slot } from '@/home/agendaZona'
import { HORIZONTE_TXT, leerFormulario, leerUrl, type Errores } from '@/home/agendaForm'
import { CamposReserva, Compromiso, LegalReserva } from '@/home/CamposReserva'
import { WA_URL } from '@/home/ui'

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
const sumaMin = (t: string, min: number) => {
  const total = Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5)) + min
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

const I = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
)
const IClock = () => <I><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></I>
const IVideo = () => <I><rect x="2.5" y="6" width="13" height="12" rx="2.5" /><path d="M15.5 11l6-3.5v9l-6-3.5z" /></I>
const IGlobe = () => <I><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" /></I>
const ISun = () => <I><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" /></I>
const IMoon = () => <I><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" /></I>
const IArrow = () => <I><path d="M5 12h14M13 6l6 6-6 6" /></I>
const IMail = () => <I><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3.5 7.5l8.5 6 8.5-6" /></I>
const IBell = () => <I><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4" /></I>
const IMeet = () => <I><rect x="2.5" y="6" width="13" height="12" rx="2.5" /><path d="M15.5 11l6-3.5v9l-6-3.5z" /></I>

const REQUERIDOS = ['name', 'email', 'phone', 'dedica', 'plantilla', 'ticket', 'clientesMes', 'objetivo', 'cuando', 'decisor']
const TOTAL = REQUERIDOS.length + 1

type Status = 'loading' | 'ready' | 'error'
type Hecho = { dia: string; hora: string; fin: string; email: string; name: string; meet?: string }

function Evento({ dia, hora, onChange }: { dia: string; hora: string; onChange?: () => void }) {
  return (
    <div className="rv-evt">
      <span className="rv-evt-bar" aria-hidden="true" />
      <div className="rv-evt-t">
        <small>Tu llamada</small>
        <b>Diagnóstico con Víctor</b>
        <span className="rv-evt-d">{dia}</span>
        <span className="rv-evt-h">
          {hora} · Videollamada de Google Meet
        </span>
      </div>
      {onChange && (
        <button type="button" className="rv-evt-ch" onClick={onChange}>
          Cambiar
        </button>
      )}
    </div>
  )
}

export default function ReservaClient() {
  const [status, setStatus] = useState<Status>('loading')
  const [days, setDays] = useState<Day[]>([])
  const [day, setDay] = useState<string | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [tz, setTz] = useState('Europe/Madrid')
  const [step, setStep] = useState(1)
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [errs, setErrs] = useState<Errores>({})
  const [hechos, setHechos] = useState(0)
  const [done, setDone] = useState<Hecho | null>(null)

  const load = useCallback(async (keep = false) => {
    if (!keep) setStatus('loading')
    try {
      const r = await fetch('/api/agenda', { cache: 'no-store' })
      const j = await r.json()
      if (!j.ok || !Array.isArray(j.days)) throw new Error('agenda')
      const zona = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid'
      const ds: Day[] = aSuZona(j.days.filter((d: Day) => d.slots?.length), zona)
      setTz(zona)
      setDays(ds)
      setStatus(ds.length ? 'ready' : 'error')
      setDay(ds[0]?.date ?? null)
      setSlot(null)
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const current = useMemo(() => days.find((d) => d.date === day), [days, day])
  const am = current?.slots.filter((s) => s.t < '14:00') ?? []
  const pm = current?.slots.filter((s) => s.t >= '14:00') ?? []
  const fueraDeMadrid = days.some((d) => d.slots.some((s) => s.es !== s.t))
  const zonaTxt = fueraDeMadrid ? nombreZona(tz) : 'Madrid'
  const avisoHora = fueraDeMadrid ? `Ves las horas en tu país (${zonaTxt}). ${diferencia(days[0]?.slots[0])}` : 'Horas en España (Madrid).'

  // Los pasos tienen su propia entrada en el historial: deslizar hacia atrás (o el botón de atrás del móvil) vuelve a elegir hora
  // en vez de sacar al lead de la página. Una vez confirmada la reserva, atrás ya no reabre el formulario.
  const hecha = useRef(false)
  useEffect(() => {
    hecha.current = !!done
  }, [done])
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      if (hecha.current) return setStep(3)
      setStep(e.state?.rvStep === 2 ? 2 : 1)
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const aHoras = () => {
    if (window.history.state?.rvStep === 2) window.history.back()
    else setStep(1)
    window.scrollTo({ top: 0 })
  }
  const ir = (n: number) => {
    setNotice(null)
    if (n === 1) return aHoras()
    setStep(n)
    try {
      if (n === 2) window.history.pushState({ rvStep: 2 }, '')
      else window.history.replaceState({ rvStep: 3 }, '')
    } catch {
      /* sin historial: los botones siguen funcionando */
    }
    window.scrollTo({ top: 0 })
  }

  const cuenta = (f: HTMLFormElement, campo?: string) => {
    // al tocar un campo marcado en rojo, se le quita el rojo
    if (campo) setErrs((prev) => (prev[campo as keyof Errores] ? { ...prev, [campo]: false } : prev))
    const fd = new FormData(f)
    const n = REQUERIDOS.filter((k) => String(fd.get(k) ?? '').trim().length > 0).length + (fd.get('compromiso') === 'on' ? 1 : 0)
    setHechos(n)
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!slot || !day || sending) return
    const { data, errs: bad, ok } = leerFormulario(new FormData(e.currentTarget))
    setErrs(bad)
    if (!ok) {
      setNotice('Te falta algún dato (en rojo). Todos son obligatorios salvo Instagram y la web.')
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>('.rv .err, .rv .err input')
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        el?.focus({ preventScroll: true })
      })
      return
    }
    setSending(true)
    setNotice(null)
    try {
      const { r: enlace, test } = leerUrl()
      const r = await fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, start: slot.start, tz, ref: document.referrer, q: location.search.replace(/[?&](r|test)=[^&]*/g, ''), r: enlace, test }),
      })
      const j = await r.json().catch(() => ({ ok: false, error: 'servidor' }))
      if (j.ok) {
        setDone({ dia: fmtDay(day), hora: `${slot.t} – ${sumaMin(slot.t, 30)}${fueraDeMadrid ? ` (hora de ${zonaTxt})` : ''}`, fin: sumaMin(slot.t, 30), email: data.email, name: data.name.split(' ')[0], meet: j.meet })
        ir(3)
        const w = window as unknown as { gtag?: (...a: unknown[]) => void }
        w.gtag?.('event', 'reserva_diagnostico', { slot: slot.start, canal: enlace ? 'instagram' : 'web' })
      } else if (j.error === 'ocupado') {
        setNotice('Ese hueco se acaba de ocupar. Te he cargado los que quedan libres.')
        aHoras()
        load(true)
      } else if (j.error === 'datos') {
        setNotice('Revisa los datos: alguno no parece válido (email o teléfono con prefijo).')
      } else if (j.error === 'limite') {
        setNotice('Hoy ya hemos recibido demasiadas reservas desde este correo. Escríbeme por WhatsApp y te la cierro yo.')
      } else {
        setNotice('No he podido confirmarla ahora mismo. Escríbeme por WhatsApp y te la cierro yo en un minuto.')
      }
    } catch {
      setNotice('No he podido confirmarla ahora mismo. Escríbeme por WhatsApp y te la cierro yo en un minuto.')
    } finally {
      setSending(false)
    }
  }

  const tab = step === 2 ? 0 : -1
  const titulo = step === 3 ? (
    <>
      ¡Reservado, <em>{done?.name || 'listo'}</em>!
    </>
  ) : step === 2 ? (
    <>
      Casi está. <em>Cuéntame lo justo.</em>
    </>
  ) : (
    <>
      Reserva tu <em>llamada</em>
    </>
  )

  return (
    <main className="rv">
      <div className="rv-in">
        <header className="rv-head">
          <div className="rv-host">
            <span className="rv-ph">
              <img src="/images/victor.webp" alt="" width={60} height={60} />
            </span>
            <div>
              <b>Víctor Vallejo</b>
              <small>Fundador de Esentia · la llamada la hago yo</small>
            </div>
          </div>
          {step === 2 && (
            <button type="button" className="rv-back" onClick={() => ir(1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
              Elegir otra hora
            </button>
          )}
          <h1>{titulo}</h1>
          {step === 1 && <p className="rv-sub">Media hora. Sales sabiendo qué atacar primero.</p>}
          {step === 1 && (
            <ul className="rv-meta">
              <li><IClock />30 min · gratis</li>
              <li><IVideo />Google Meet</li>
              <li><IGlobe />Hora de {zonaTxt}</li>
            </ul>
          )}
        </header>

        <ol className="rv-prog" aria-label="Pasos">
          {['Cuándo', 'Tus datos', 'Listo'].map((s, i) => (
            <li key={s} data-on={step >= i + 1 ? '1' : '0'} aria-current={step === i + 1 ? 'step' : undefined}>
              {s}
            </li>
          ))}
        </ol>

        {notice && (
          <p className="rv-notice" role="status">
            {notice}
            {!notice.startsWith('Ese hueco') && !notice.startsWith('Revisa') && !notice.startsWith('Te falta') && (
              <a href={WA_URL} target="_blank" rel="noopener">
                Abrir WhatsApp
              </a>
            )}
          </p>
        )}

        {step === 1 && (
          <section className="rv-pane" aria-label="Elige día y hora">
            {status === 'error' ? (
              <div className="rv-card rv-err">
                <p>
                  <b>No puedo cargar la agenda ahora mismo.</b> Escríbeme y te doy hueco hoy mismo.
                </p>
                <a className="rv-btn" href={WA_URL} target="_blank" rel="noopener">
                  <span>Escribir por WhatsApp</span>
                  <span className="rv-bi"><IArrow /></span>
                </a>
                <button type="button" className="rv-btn ghost" onClick={() => load()}>
                  Reintentar
                </button>
              </div>
            ) : (
              <>
                <div className="rv-card">
                  <p className="rv-q">¿Qué día te viene bien?</p>
                  <div className="rv-days" role="group" aria-label="Día">
                    {status !== 'ready'
                      ? Array.from({ length: 4 }).map((_, i) => <span key={i} className="rv-day sk" />)
                      : days.map((d) => {
                          const dt = parse(d.date)
                          return (
                            <button key={d.date} type="button" className="rv-day" aria-pressed={d.date === day} onClick={() => { setDay(d.date); setSlot(null) }}>
                              <small>{DIAS[dt.getDay()].slice(0, 3)}</small>
                              <b>{dt.getDate()}</b>
                              <small>{MESES[dt.getMonth()].slice(0, 3)}</small>
                              <em>{d.slots.length} huecos</em>
                            </button>
                          )
                        })}
                  </div>
                  {status === 'ready' && day && (
                    <>
                      <p className="rv-q rv-q2">¿A qué hora?</p>
                      <p className="rv-tz">{avisoHora}</p>
                      {[['Mañana', am, <ISun key="s" />], ['Tarde', pm, <IMoon key="m" />]].map(([lab, list, ico]) =>
                        (list as Slot[]).length ? (
                          <div key={lab as string}>
                            <p className="rv-lab">{ico as ReactNode}{lab as string}</p>
                            <div className="rv-slots">
                              {(list as Slot[]).map((s) => (
                                <button key={s.start} type="button" className="rv-slot" aria-pressed={slot?.start === s.start} onClick={() => setSlot(slot?.start === s.start ? null : s)}>
                                  {s.t}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null,
                      )}
                    </>
                  )}
                  <p className="rv-horizonte">
                    {HORIZONTE_TXT}{' '}
                    <a href={WA_URL} target="_blank" rel="noopener">
                      Abrir WhatsApp
                    </a>
                  </p>
                </div>
                {slot && day && <Evento dia={fmtDay(day)} hora={`${slot.t} – ${sumaMin(slot.t, 30)}`} />}
                <button type="button" className="rv-btn" disabled={!slot} onClick={() => ir(2)}>
                  <span>{slot ? 'Continuar' : 'Elige una hora'}</span>
                  <span className="rv-bi"><IArrow /></span>
                </button>
              </>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="rv-pane" aria-label="Tus datos">
            {slot && day && <Evento dia={fmtDay(day)} hora={`${slot.t} – ${sumaMin(slot.t, 30)}${fueraDeMadrid ? ` · en España, las ${slot.es}` : ''}`} onChange={() => ir(1)} />}
            <div className="rv-meter" aria-live="polite">
              <span>
                Llevas <b>{hechos}</b> de {TOTAL}
              </span>
              <i>
                <b style={{ width: `${Math.round((hechos / TOTAL) * 100)}%` }} />
              </i>
            </div>
            <form onSubmit={submit} onInput={(e) => cuenta(e.currentTarget, (e.target as HTMLInputElement).name)} onChange={(e) => cuenta(e.currentTarget, (e.target as HTMLInputElement).name)} noValidate>
              <div className="rv-card">
                <div className="form">
                  <CamposReserva errs={errs} tab={tab} />
                </div>
              </div>
              <Compromiso error={errs.compromiso} tab={tab} />
              <LegalReserva />
              <button type="submit" className="rv-btn" disabled={sending}>
                <span>{sending ? 'Confirmando…' : 'Confirmar mi hueco'}</span>
                <span className={`rv-bi${sending ? ' spin' : ''}`}><IArrow /></span>
              </button>
              <button type="button" className="rv-btn ghost" onClick={() => ir(1)}>
                Cambiar la hora
              </button>
            </form>
          </section>
        )}

        {step === 3 && done && (
          <section className="rv-pane rv-done" aria-label="Reserva confirmada">
            <div className="rv-tick">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12.5l5 5L20 6.5" />
              </svg>
            </div>
            <Evento dia={done.dia} hora={done.hora} />
            <p className="rv-q rv-next-t">Qué pasa ahora</p>
            <ol className="rv-next">
              <li>
                <span className="rv-ni"><IMail /></span>
                <div>
                  <b>Te llega la invitación</b>
                  <span>
                    A <strong>{done.email}</strong>, con el enlace de Google Meet.
                  </span>
                </div>
              </li>
              <li>
                <span className="rv-ni"><IBell /></span>
                <div>
                  <b>Si no puedes venir, avísame</b>
                  <span>Con al menos 2 horas: responde a la invitación o escríbeme por Instagram o WhatsApp.</span>
                </div>
              </li>
              <li>
                <span className="rv-ni"><IMeet /></span>
                <div>
                  <b>Nos vemos en la videollamada</b>
                  <span>Entras desde el enlace de la invitación, sin instalar nada.</span>
                </div>
              </li>
            </ol>
            {done.meet && (
              <a className="rv-btn" href={done.meet} target="_blank" rel="noopener">
                <span>Abrir enlace de Meet</span>
                <span className="rv-bi"><IArrow /></span>
              </a>
            )}
            <a className="rv-btn ghost" href={WA_URL} target="_blank" rel="noopener">
              ¿Algo antes? Escríbeme por WhatsApp
            </a>
          </section>
        )}
      </div>
    </main>
  )
}
