'use client'
import { useState } from 'react'
import { MAIL, WA_URL } from './ui'

const QA = [
  ['¿Solo hacéis chatbots?', 'No. El chatbot es una pieza entre muchas. Hacemos lo que pida tu cuello de botella: captación, pedidos, facturas, seguimiento, llamadas o atención.'],
  ['¿Qué sale del diagnóstico?', 'Dónde se te van las horas y el dinero, y qué atacar primero. Te lo llevas, contrates o no.'],
  ['¿Necesito saber de tecnología?', 'No. Tú nos cuentas el problema y nosotros lo resolvemos. Tu equipo sigue trabajando como siempre, con menos trabajo a mano.'],
  ['¿Funciona con lo que ya uso?', 'Casi siempre: tu programa de gestión, Excel, Google, WhatsApp, tu CRM… Lo confirmamos en la sesión antes de prometerte nada.'],
  ['¿Y si algo falla?', 'Lo vigilamos nosotros. Si algo se sale de lo normal, avisa a una persona y queda registrado. Nada se queda en el aire.'],
  ['¿Cuánto cuesta?', 'Depende del alcance. En la sesión te digo cuánto y en cuánto tiempo lo recuperas. Sin permanencia.'],
]

export default function Dudas() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="sec" id="dudas">
      <div className="wrap dudas">
        <div className="sec-head rv">
          <h2 className="display">
            Lo que nos preguntan <em>antes de empezar.</em>
          </h2>
        </div>
        <div className="faq rv">
          {QA.map(([q, a], i) => (
            <div className="q" data-open={open === i ? '1' : '0'} key={q}>
              <button type="button" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? null : i)}>
                {q}
                <i aria-hidden="true" />
              </button>
              <div className="a" id={`faq-${i}`} role="region">
                <div>
                  <p>{a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="wrap">
        <div className="contact rv">
          <a className="cc" href={WA_URL} target="_blank" rel="noopener">
            <span className="k">WhatsApp</span>
            <b>+34 711 237 051</b>
            <span>Hablas directamente conmigo.</span>
          </a>
          <a className="cc" href={`mailto:${MAIL}`}>
            <span className="k">Email</span>
            <b>{MAIL}</b>
            <span>Para propuestas y dudas largas.</span>
          </a>
          <a className="cc" href="https://instagram.com/victorvallejo.ia" target="_blank" rel="noopener">
            <span className="k">Instagram</span>
            <b>@victorvallejo.ia</b>
            <span>Lo que voy montando, en vídeo.</span>
          </a>
        </div>
      </div>
    </section>
  )
}
