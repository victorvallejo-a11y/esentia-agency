import { LogoMark } from './ui'

/* Cómo trabajamos · recorrido horizontal. Al bajar, las cuatro fases pasan de
   lado y cada una se monta sola: la videollamada, la propuesta, las conexiones
   y el informe del mes. Las barras de arriba avanzan como historias. */

const STEPS = ['Diagnóstico', 'Propuesta', 'Puesta en marcha', 'Mejora']

const APPS: [string, string, string][] = [
  ['WhatsApp', '#25d366', 'M12 4a8 8 0 0 0-6.9 12l-1.1 4 4.1-1.1A8 8 0 1 0 12 4z'],
  ['Calendario', '#ff3b30', 'M5 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM5 10.5h14M9 4v4M15 4v4'],
  ['Tu programa de gestión', '#5856d6', 'M4.5 8 12 4l7.5 4v8L12 20l-7.5-4zM4.5 8 12 12l7.5-4M12 12v8'],
  ['Facturación', '#ff9500', 'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h5M9.5 15.5h5'],
  ['Correo', '#007aff', 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4.5 7.5 12 13l7.5-5.5'],
]

// El mapa que sale del diagnóstico: el proceso real y la pieza que se atasca.
const FLOW: [string, string, string, string][] = [
  ['Entra el pedido', 'WhatsApp y audios', '#25d366', 'M12 4a8 8 0 0 0-6.9 12l-1.1 4 4.1-1.1A8 8 0 1 0 12 4z'],
  ['Se pasa a mano', '3 h al día', '#ff9f0a', 'M3.5 7.5A1.5 1.5 0 0 1 5 6h14a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 18H5a1.5 1.5 0 0 1-1.5-1.5zM7 10h.01M10.5 10h.01M14 10h.01M17 10h.01M8 14h8'],
  ['Albarán', 'al día siguiente', '#007aff', 'M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h5M9.5 15.5h5'],
  ['Reparto', 'con errores en ruta', '#5856d6', 'M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7M6 18.5a1.8 1.8 0 1 0 0-.01M17 18.5a1.8 1.8 0 1 0 0-.01'],
]

const MONTHS: [string, number][] = [['may', 8], ['jun', 17], ['jul', 24], ['ago', 29], ['sep', 38], ['oct', 46]]

export default function Metodo() {
  return (
    <section className="how" id="como" aria-label="Cómo trabajamos">
      <div className="how-pin">
        <div className="wrap how-top">
          <h2 className="display">
            Primero el diagnóstico. <em>Después, la tecnología.</em>
          </h2>
          <ol className="how-prog" aria-hidden="true">
            {STEPS.map((s) => (
              <li key={s}>
                <i><b /></i>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="how-track">
          {/* 01 · Diagnóstico */}
          <article className="phs phs1">
            <div className="hp-txt">
              <span className="hp-n">01</span>
              <h3>Diagnóstico</h3>
              <p>Media hora contigo. Te llevas el mapa, contrates o no.</p>
              <span className="hp-d">30 min · gratis</span>
            </div>
            <div className="hp-vis v-map" aria-hidden="true">
              <div className="sess">
                <img src="/images/victor.webp" alt="" width={600} height={600} loading="lazy" />
                <span>
                  <b>Sesión de diagnóstico</b>
                  <small className="call-t">00:00</small>
                </span>
              </div>
              <div className="flow">
                {FLOW.map(([t, s, c, d], i) => (
                  <div className={i === 1 ? 'fs neck' : 'fs'} key={t}>
                    <span className="fs-ic" style={{ background: c }}>
                      <svg viewBox="0 0 24 24"><path d={d} /></svg>
                    </span>
                    <span className="fs-t">
                      <b>{t}</b>
                      <small>{s}</small>
                    </span>
                    {i === 1 && <em className="neck-l">Cuello de botella</em>}
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* 02 · Propuesta */}
          <article className="phs phs2">
            <div className="hp-txt">
              <span className="hp-n">02</span>
              <h3>Propuesta</h3>
              <p>Qué atacamos, cómo y cuánto cuesta. Por escrito.</p>
              <span className="hp-d">en 48 h</span>
            </div>
            <div className="hp-vis v-doc" aria-hidden="true">
              <div className="pdoc">
                <div className="pd-h">
                  <span className="app-ic pd-logo"><LogoMark /></span>
                  <span>
                    <b>Propuesta</b>
                    <small>Ejemplo · 2 páginas</small>
                  </span>
                </div>
                <div className="pd-s">
                  <small>Qué atacamos primero</small>
                  <p>Los pedidos de WhatsApp entran solos en tu programa.</p>
                </div>
                <div className="pd-s pd-cmp">
                  <small>Horas al mes pasando pedidos</small>
                  <div className="cmp"><span>Hoy</span><i><b className="b1" /></i><strong>66 h</strong></div>
                  <div className="cmp"><span>Con el sistema</span><i><b className="b2" /></i><strong>8 h</strong></div>
                </div>
                <div className="pd-sign">
                  <svg viewBox="0 0 160 46" className="sig">
                    <path d="M6 32c10-14 16-24 22-22s-8 26 0 26 14-30 22-28-6 22 2 22 12-16 18-14 2 12 10 10 10-8 18-8 18 6 30 2" pathLength={100} />
                  </svg>
                  <span className="pd-ok">
                    <i><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" /></svg></i>
                    Aceptada
                  </span>
                </div>
              </div>
              <div className="mail">
                <span className="mail-ic"><svg viewBox="0 0 24 24"><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4.5 7.5 12 13l7.5-5.5" /></svg></span>
                <p>
                  <b>Víctor Vallejo<small>ahora</small></b>
                  Tu propuesta, como quedamos.
                </p>
              </div>
            </div>
          </article>

          {/* 03 · Puesta en marcha */}
          <article className="phs phs3">
            <div className="hp-txt">
              <span className="hp-n">03</span>
              <h3>Puesta en marcha</h3>
              <p>Conectado a lo que ya usas. Probado antes de soltarlo.</p>
              <span className="hp-d">desde 1 semana · sin permanencia</span>
            </div>
            <div className="hp-vis v-set" aria-hidden="true">
              <div className="set">
                <p className="set-h">Conexiones</p>
                <div className="set-g">
                  {APPS.map(([n, c, d]) => (
                    <div className="set-r" key={n}>
                      <span className="set-ic" style={{ background: c }}>
                        <svg viewBox="0 0 24 24"><path d={d} /></svg>
                      </span>
                      <span className="set-n">{n}</span>
                      <span className="tg"><i /></span>
                    </div>
                  ))}
                </div>
                <div className="set-g set-st">
                  <div className="set-r">
                    <span className="set-ic run"><svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 1 0 8 8" /></svg></span>
                    <span className="set-n">Pruebas con casos reales</span>
                    <b className="set-c">0/20</b>
                  </div>
                  <div className="set-r set-ok">
                    <span className="set-ic" style={{ background: '#34c759' }}><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" /></svg></span>
                    <span className="set-n">En marcha</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* 04 · Mejora */}
          <article className="phs phs4">
            <div className="hp-txt">
              <span className="hp-n">04</span>
              <h3>Mejora</h3>
              <p>Medimos cada mes. Y vamos a por el siguiente.</p>
              <span className="hp-d">cada mes</span>
            </div>
            <div className="hp-vis v-rep" aria-hidden="true">
              <div className="rep">
                <div className="rep-h">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
                  <b>Horas devueltas</b>
                  <small>Informe mensual</small>
                </div>
                <p className="rep-n"><span className="rep-c">0</span><small>h este mes</small></p>
                <div className="rep-ch">
                  {MONTHS.map(([m, v], i) => (
                    <span key={m} className={i === MONTHS.length - 1 ? 'on' : ''}>
                      <i style={{ height: `${(v / 46) * 100}%` }} />
                      <small>{m}</small>
                    </span>
                  ))}
                </div>
              </div>
              <div className="next">
                <span className="next-ic"><svg viewBox="0 0 24 24"><path d="M19 12a7 7 0 1 1-2.1-5M19 4.5V9h-4.5" /></svg></span>
                <p>
                  <b>Siguiente cuello de botella</b>
                  Las facturas de proveedores
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
