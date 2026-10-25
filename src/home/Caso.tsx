import type { ReactNode } from 'react'
import Phone, { Ticks, WaInput, WaNav } from './Phone'
import { Btn } from './ui'

/* Último caso de éxito. El móvil entra girando con el scroll y, mientras bajas,
   la conversación real de la clínica avanza mensaje a mensaje. Alrededor salen
   las piezas que se mueven por detrás: agenda, ficha, consentimiento, recordatorio. */

const SIDES: [string, string, string, ReactNode][] = [
  ['c-cal', 'Cita creada en la agenda', 'Jueves 17:00 · Marta Soler', <path key="a" d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5zM4 10h16M8.5 3v4M15.5 3v4" />],
  ['c-fic', 'Ficha de paciente, completa', 'Nueva · llegó por WhatsApp', <path key="b" d="M12 12a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2zM5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />],
  ['c-doc', 'Consentimiento firmado', 'Archivado en su ficha', <path key="c" d="M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.8 13.6l1.9 1.9 3.5-3.8" />],
  ['c-bel', 'Recordatorio programado', '24 h antes, sin que nadie lo envíe', <path key="d" d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5L19 18H5zM10 20.5a2.2 2.2 0 0 0 4 0" />],
]

const CAL = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5zM4 10h16M8.5 3v4M15.5 3v4" />
  </svg>
)
const PEN = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M14.5 5.5l4 4L8 20H4v-4zM12.5 7.5l4 4" />
  </svg>
)

export default function Caso() {
  return (
    <section className="case-sec" id="caso">
      <div className="case-pin">
        <div className="wrap case">
          <div className="case-head rv">
            <p className="case-k">Caso de éxito real</p>
            <p className="who">
              Clínica Dra. Janice Middleton
              <small>Medicina estética · Barcelona</small>
            </p>
            <h2 className="display">
              La doctora ya no lleva la agenda. <em>La lleva Laura.</em>
            </h2>
            <p className="case-line">
              Un ejemplo real de lo que montamos: Laura, su asistente, lleva citas, fichas, consentimientos y recordatorios. WhatsApp es solo la puerta.
            </p>
          </div>

          <div className="case-stage-wrap">
          <div className="case-stage" role="img" aria-label="Conversación real de la clínica por WhatsApp: la paciente pide cita a las 23:41 y Laura la agenda, le envía el consentimiento y programa el recordatorio.">
            <div className="ph-persp">
              <div className="ph-tilt">
              <Phone depth tone="black" time="23:41" className="case-ph">
                <div className="wa-app">
                  <WaNav
                    name="Clínica Middleton"
                    avatar={<span className="av-cl">JM</span>}
                    sub={
                      <>
                        <span className="onl">en línea</span>
                        <span className="typ">escribiendo…</span>
                      </>
                    }
                  />
                  <div className="wa-body">
                    <div className="wa-list">
                      <span className="wa-day">Hoy</span>
                      <div className="wr o t k">
                        <p className="wb">Hola, quería pedir cita para una valoración. ¿Tenéis algo el jueves?<span className="sp" /><span className="wt">23:41<Ticks /></span></p>
                      </div>
                      <div className="wr i t k">
                        <span className="wty"><i /><i /><i /></span>
                        <p className="wb">Hola, Marta. Soy Laura, de la clínica. El jueves tengo a las 17:00 o a las 18:30. ¿Cuál te va mejor?<span className="sp" /><span className="wt">23:41</span></p>
                      </div>
                      <div className="wr o t k">
                        <p className="wb">A las 17:00 perfecto<span className="sp" /><span className="wt">23:42<Ticks /></span></p>
                      </div>
                      <div className="wr i t k">
                        <span className="wty"><i /><i /><i /></span>
                        <div className="wb rich">
                          <div className="ev">
                            <span className="ev-ic"><small>JUE</small><b>24</b></span>
                            <div>
                              <strong>Valoración · primera visita</strong>
                              <span>Jueves · 17:00 – 17:30</span>
                              <span>Dra. Janice Middleton</span>
                            </div>
                          </div>
                          <span className="wt">23:42</span>
                          <span className="wbtn">{CAL}Añadir al calendario</span>
                        </div>
                      </div>
                      <div className="wr i k">
                        <div className="wb rich">
                          <div className="dc">
                            <span className="dc-ic" />
                            <div>
                              <strong>Consentimiento informado.pdf</strong>
                              <span>2 páginas · PDF</span>
                            </div>
                          </div>
                          <span className="wt">23:42</span>
                          <span className="wbtn">{PEN}Firmar ahora</span>
                        </div>
                      </div>
                      <div className="wr o t k">
                        <p className="wb">Firmado. ¡Gracias!<span className="sp" /><span className="wt">23:43<Ticks /></span></p>
                      </div>
                    </div>
                  </div>
                  <WaInput />
                </div>
                <div className="ios-ban">
                  <span className="app">
                    <svg viewBox="0 0 24 24"><path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2z" /></svg>
                  </span>
                  <p>
                    <b>Clínica Dra. Middleton<small>ahora</small></b>
                    Mañana a las 17:00 te esperamos. Si te surge algo, responde aquí.
                  </p>
                </div>
              </Phone>
              </div>
              <span className="ph-shadow" />
            </div>

            {SIDES.map(([c, t, s, ic], i) => (
              <div className={`side s${i + 1} ${c}`} key={t}>
                <span className="side-ic">
                  <svg viewBox="0 0 24 24">{ic}</svg>
                </span>
                <p>
                  <b>{t}</b>
                  {s}
                </p>
              </div>
            ))}
          </div>
          </div>

          <div className="case-rest">
            <div className="stats" id="stats">
              <div className="stat">
                <div className="n"><span data-count="46">46</span><small>h/mes</small></div>
                <div className="l">devueltas a la consulta</div>
              </div>
              <div className="stat">
                <div className="n"><span data-count="3284">3.284</span><small>€/mes</small></div>
                <div className="l">recuperados en citas que antes se perdían</div>
              </div>
              <div className="stat">
                <div className="n">24<small>/7</small></div>
                <div className="l">atendiendo pacientes</div>
              </div>
            </div>
            <Btn href="#agenda">Quiero un sistema así</Btn>
          </div>
        </div>
      </div>
    </section>
  )
}
