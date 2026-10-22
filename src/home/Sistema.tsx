import Phone, { Ticks, WaInput, WaNav } from './Phone'
import { LogoMark } from './ui'

/* Qué hacemos · "alejar la cámara".
   Empieza pegado a un móvil con WhatsApp (lo que vende todo el mundo). Al bajar,
   la cámara se aleja y ese chat resulta ser una pieza de una máquina mayor:
   avisos, calendario, pedidos, facturas, seguimiento y panel, como en iOS.
   Las posiciones están en el CSS (escritorio y móvil) y los cables se dibujan
   en Scenes a partir de ellas. */

const STORE = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3.6 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3-.6M5.5 11.5V20h13v-8.5M10 20v-5h4v5" />
  </svg>
)

export default function Sistema() {
  return (
    <section className="sys" id="que" aria-label="Qué hacemos">
      <div className="sys-pin">
        <div className="sys-copy wrap">
          <h2 className="display sys-st st1">
            <em>Lo que te vende el resto:</em> un simple chatbot.
          </h2>
          <h2 className="display sys-st st2">
            <em>Lo que de verdad hace falta:</em> un sistema que mueve todo tu negocio.
          </h2>
          <h2 className="display sys-st st3">
            <em>Lo que hacemos:</em> encontrar lo que te frena y conectarlo todo.
          </h2>
        </div>

        <div className="sys-stage" aria-hidden="true">
          <div className="board">
            <svg className="wires" />

            <div className="hub">
              <span className="hub-wave" />
              <span className="hub-wave w2" />
              <span className="app-ic hub-ic">
                <LogoMark />
              </span>
              <b>Tu negocio</b>
            </div>

            {/* El chat: lo único que te enseñan los demás */}
            <div className="mod mod-chat">
              <Phone tone="natural" time="21:14">
                <div className="wa-app">
                  <WaNav
                    name="Tu negocio"
                    avatar={<span className="av-store">{STORE}</span>}
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
                      <div className="wr o t c1">
                        <p className="wb">Hola, ¿tenéis hueco esta semana?<span className="sp" /><span className="wt">21:14<Ticks /></span></p>
                      </div>
                      <div className="wr i t c2">
                        <span className="wty"><i /><i /><i /></span>
                        <p className="wb">¡Hola! Sí: el jueves a las 11:00 o a las 17:30. ¿Cuál te va mejor?<span className="sp" /><span className="wt">21:14</span></p>
                      </div>
                      <div className="wr o t c3">
                        <p className="wb">El jueves a las 11<span className="sp" /><span className="wt">21:15<Ticks /></span></p>
                      </div>
                      <div className="wr i t c4">
                        <p className="wb">Hecho. Te he enviado la confirmación.<span className="sp" /><span className="wt">21:15</span></p>
                      </div>
                    </div>
                  </div>
                  <WaInput />
                </div>
              </Phone>
            </div>

            {/* Captación: avisos de iOS que llegan solos */}
            <div className="mod mod-capt">
              <div className="nts">
                {[
                  ['Particular nuevo · Terrassa', 'Piso 3 hab · 189.000 € · con teléfono', 'ahora'],
                  ['Particular nuevo · Sabadell', 'Ático 2 hab · 245.000 € · con teléfono', '4 min'],
                  ['Particular nuevo · Rubí', 'Casa 4 hab · 320.000 € · con teléfono', '9 min'],
                ].map(([t, b, w], i) => (
                  <div className={`nt n${i}`} key={t}>
                    <span className="nt-ic">
                      <svg viewBox="0 0 24 24"><path d="M3.5 11 12 4l8.5 7M6 9.2V20h12V9.2M10 20v-5.5h4V20" /></svg>
                    </span>
                    <p>
                      <b>{t}<small>{w}</small></b>
                      {b}
                    </p>
                  </div>
                ))}
              </div>
              <span className="lbl">Captación</span>
            </div>

            {/* Agenda: widget de Calendario */}
            <div className="mod mod-age">
              <div className="wg cal">
                <div className="cal-d">
                  <small>JUEVES</small>
                  <b>24</b>
                  <span>3 citas</span>
                </div>
                <div className="cal-e">
                  <p className="e e1"><i /><span><b>Visita · Piso Terrassa</b>9:30 – 10:00</span></p>
                  <p className="e e2"><i /><span><b>Cita nueva · WhatsApp</b>11:00 – 11:30</span></p>
                  <p className="e e3"><i /><span><b>Llamada · Bar Rius</b>17:30</span></p>
                </div>
              </div>
              <span className="lbl">Agenda</span>
            </div>

            {/* Pedidos: audio → lista de iOS */}
            <div className="mod mod-ped">
              <div className="wg rem">
                <div className="rem-h">
                  <span className="rem-ic"><svg viewBox="0 0 24 24"><path d="M9 6.5h11M9 12h11M9 17.5h11" /><circle cx="4.5" cy="6.5" r="1.3" /><circle cx="4.5" cy="12" r="1.3" /><circle cx="4.5" cy="17.5" r="1.3" /></svg></span>
                  <b>Pedido · Bar Rius</b>
                  <strong>3</strong>
                </div>
                <div className="vn">
                  <span className="vn-p" />
                  <span className="vn-w">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <i key={i} style={{ height: `${22 + ((i * 37) % 70)}%` }} />
                    ))}
                  </span>
                  <small>0:14</small>
                </div>
                {['12 kg tomate pera', '6 cajas lechuga', '4 garrafas aceite 5 l'].map((t, i) => (
                  <p className={`rm rm${i}`} key={t}>
                    <i />
                    {t}
                  </p>
                ))}
                <span className="rem-f">Ruta 2 · sale a las 6:30</span>
              </div>
              <span className="lbl">Pedidos</span>
            </div>

            {/* Facturas: escáner + campos leídos */}
            <div className="mod mod-fac">
              <div className="wg scan">
                <div className="paper">
                  <b>FACTURA</b>
                  <small>Harinas Molí · 0412</small>
                  <i /><i /><i /><i />
                  <em>453,20 €</em>
                  <span className="beam" />
                  <span className="crn" />
                </div>
                <div className="rows">
                  <p><span>Proveedor</span>Harinas Molí</p>
                  <p><span>Base</span>412,00 €</p>
                  <p><span>IVA 10 %</span>41,20 €</p>
                  <p className="tot"><span>Total</span>453,20 €</p>
                  <p className="sent"><i><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" /></svg></i>En la gestoría</p>
                </div>
              </div>
              <span className="lbl">Facturas</span>
            </div>

            {/* Seguimiento: actividad en directo, como la Isla Dinámica */}
            <div className="mod mod-crm">
              <div className="wg lact">
                <div className="live-t">
                  <span className="app-ic live-ic"><LogoMark /></span>
                  <span className="live-w">
                    <b>Hotel Sitges</b>
                    <small>Propuesta vista · seguimiento enviado</small>
                  </span>
                  <strong>día 3</strong>
                </div>
                <div className="live-bar"><i /></div>
                <div className="live-s"><span>Nuevo</span><span>Propuesta</span><span>Cerrado</span></div>
              </div>
              <span className="lbl">Seguimiento</span>
            </div>

            {/* Panel: estilo Salud */}
            <div className="mod mod-pan">
              <div className="wg pan">
                <div className="pan-h">
                  <svg viewBox="0 0 24 24"><path d="M4 16l5-5 4 3 7-8" /><path d="M15 6h5v5" /></svg>
                  <b>Ventas</b>
                  <small>Este mes</small>
                </div>
                <p className="pan-n">+9 %<span>vs. septiembre</span></p>
                <div className="bars">
                  {[34, 42, 38, 50, 46, 58, 54, 62, 60, 72, 70, 84].map((h, i) => (
                    <i key={i} className={i > 8 ? 'on' : ''} style={{ height: `${h}%`, animationDelay: `${i * 0.06}s` }} />
                  ))}
                </div>
              </div>
              <span className="lbl">Panel</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
