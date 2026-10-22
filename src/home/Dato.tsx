const WORDS = ['El', '94%', 'de', 'los', 'empleados', 'de', 'pymes', 'pierde', 'tiempo', 'en', 'tareas', 'repetitivas.']
const QUESTION = ['¿Y', 'en', 'tu', 'negocio?']

/** El dato: se fija en pantalla, las palabras nacen una a una y se va con el scroll. */
export default function Dato() {
  return (
    <section className="dato" id="dato" aria-label="El dato">
      <div className="dato-glow" aria-hidden="true" />
      <div className="dato-in">
        <span className="dato-rule" aria-hidden="true" />
        <p className="dato-line" aria-label="El 94% de los empleados de pymes pierde tiempo en tareas repetitivas. ¿Y en tu negocio?">
          {WORDS.map((w, i) => (
            <span key={i} className={`w${w === '94%' ? ' num' : ''}`} aria-hidden="true">
              {w}
            </span>
          ))}
          {QUESTION.map((w, i) => (
            <span key={`q${i}`} className="w q" aria-hidden="true">
              {w}
            </span>
          ))}
        </p>
        <p className="dato-sub">
          No te falta un chatbot. Te sobra un <b>cuello de botella</b>.
        </p>
        <p className="dato-src">Fuente: Zapier, State of Business Automation</p>
      </div>
    </section>
  )
}
