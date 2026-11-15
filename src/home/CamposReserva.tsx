'use client'
import { useEffect, useState } from 'react'
import { COMPROMISO_CHK, COMPROMISO_TIT, COMPROMISO_TXT, PAISES, PAIS_OTRO, PRIVACIDAD_TXT, cifraValida, esSolo, monedaPorPais, paisPorZona, tramosPresupuesto, type Errores } from './agendaForm'

// Campos de la reserva, iguales en la home y en /reserva. Va dentro de <div className="form">.
export function CamposReserva({ errs, tab }: { errs: Errores; tab: 0 | -1 }) {
  const [pais, setPais] = useState('España')
  const [decisor, setDecisor] = useState('')
  const [presupuesto, setPresupuesto] = useState('')
  const [ticket, setTicket] = useState('')
  const [clientesMes, setClientesMes] = useState('')
  useEffect(() => {
    try {
      setPais(paisPorZona(Intl.DateTimeFormat().resolvedOptions().timeZone || ''))
    } catch {
      /* se queda España */
    }
  }, [])
  const tramos = tramosPresupuesto(monedaPorPais(pais))
  // si cambia de país y con él la moneda, el tramo elegido ya no existe: que lo vuelva a elegir
  useEffect(() => {
    setPresupuesto('')
  }, [tramos[0]])
  const otro = pais === PAIS_OTRO
  const prefijo = PAISES.find((p) => p.n === pais)?.p ?? ''
  const hayOtroDecisor = decisor.trim().length >= 2 && !esSolo(decisor)
  const c = (k: keyof Errores) => (errs[k] ? 'err' : '')
  // cifras: en cuanto escribe, manda lo que ve (rojo si es 0 o no hay cifra); si está vacío, manda el error del envío
  const vivo = (v: string, k: keyof Errores) => (v === '' ? c(k) : cifraValida(v) ? '' : 'err')

  return (
    <>
      <p className="grp wide">Sobre ti</p>
      <label>
        Nombre
        <input id="f-name" name="name" type="text" autoComplete="name" enterKeyHint="next" className={c('name')} tabIndex={tab} />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" inputMode="email" enterKeyHint="next" className={c('email')} tabIndex={tab} />
      </label>
      <label>
        País
        <select name="pais" value={pais} onChange={(e) => setPais(e.target.value)} autoComplete="country-name" className={c('pais')} tabIndex={tab}>
          {PAISES.map((p) => (
            <option key={p.n} value={p.n}>
              {p.n}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>
          Teléfono <em>· con prefijo</em>
        </span>
        <span className="phone-row">
          {otro ? (
            <input name="prefijoOtro" type="tel" inputMode="tel" placeholder="+00" aria-label="Prefijo" className={`pfx-in ${c('phone')}`} tabIndex={tab} />
          ) : (
            <span className="pfx" aria-hidden="true">
              {prefijo}
            </span>
          )}
          <input name="phone" type="tel" autoComplete="tel-national" inputMode="tel" placeholder="600 000 000" enterKeyHint="next" className={c('phone')} tabIndex={tab} />
        </span>
      </label>
      {otro && (
        <label className="wide">
          ¿Desde qué país?
          <input name="paisOtro" type="text" autoComplete="off" className={c('pais')} tabIndex={tab} />
        </label>
      )}
      <label className="wide">
        Si me has escrito por Instagram, dime tu usuario
        <input name="ig" type="text" autoComplete="off" autoCapitalize="none" placeholder="@tuusuario" tabIndex={tab} />
      </label>
      <input className="hp" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p className="grp wide">Tu empresa</p>
      <label className="wide">
        ¿A qué se dedica tu empresa?
        <input name="dedica" type="text" className={c('dedica')} tabIndex={tab} />
      </label>
      <label>
        ¿Cuántas personas trabajan en ella?
        <input name="plantilla" type="text" inputMode="numeric" className={c('plantilla')} tabIndex={tab} />
      </label>
      <label>
        <span>
          Web de la empresa <em>· opcional</em>
        </span>
        <input name="webEmpresa" type="text" inputMode="url" autoCapitalize="none" autoComplete="off" placeholder="tuempresa.com" tabIndex={tab} />
      </label>
      <label>
        Ticket medio por cliente u obra
        <input name="ticket" type="text" value={ticket} onChange={(e) => setTicket(e.target.value)} placeholder="Ej. 3.000 € (aproximado, mayor que 0)" className={vivo(ticket, 'ticket')} aria-invalid={ticket !== '' && !cifraValida(ticket)} tabIndex={tab} />
        {ticket !== '' && !cifraValida(ticket) && <span style={{ color: '#c0392b', fontSize: 12.5, fontWeight: 400 }}>Pon una cifra mayor que 0, aunque sea aproximada.</span>}
      </label>
      <label>
        ¿Cuántos clientes nuevos suelen venirte al mes?
        <input name="clientesMes" type="text" inputMode="numeric" value={clientesMes} onChange={(e) => setClientesMes(e.target.value)} placeholder="Ej. 10 (aproximado, mayor que 0)" className={vivo(clientesMes, 'clientesMes')} aria-invalid={clientesMes !== '' && !cifraValida(clientesMes)} tabIndex={tab} />
        {clientesMes !== '' && !cifraValida(clientesMes) && <span style={{ color: '#c0392b', fontSize: 12.5, fontWeight: 400 }}>Pon una cifra mayor que 0, aunque sea aproximada.</span>}
      </label>
      <p className="grp wide">La llamada</p>
      <label className="wide">
        ¿Qué quieres conseguir con la llamada?
        <input name="objetivo" type="text" className={c('objetivo')} tabIndex={tab} />
      </label>
      <label className="wide">
        Si encontramos una solución, ¿para cuándo la querrías en marcha?
        <input name="cuando" type="text" placeholder="Ej. este mes, en 3 meses" className={c('cuando')} tabIndex={tab} />
      </label>
      <label className="wide">
        Presupuesto
        {/* sin value controlado: el formulario escucha «input» y React lo devolvía a vacío antes del «change». La key lo reinicia al cambiar de moneda. */}
        <select key={tramos[0]} name="presupuesto" defaultValue="" onChange={(e) => setPresupuesto(e.target.value)} className={c('presupuesto')} tabIndex={tab}>
          <option value="" disabled>
            Elige un tramo
          </option>
          {tramos.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {presupuesto === tramos[0] && (
          <span role="note" style={{ marginTop: 2, padding: '10px 12px', borderRadius: 12, background: 'rgba(192,57,43,0.06)', boxShadow: 'inset 0 0 0 1px rgba(192,57,43,0.35)', color: '#c0392b', fontSize: 13, fontWeight: 400, lineHeight: 1.45 }}>
            Trabajo con un número limitado de clientes al mes para garantizar la calidad, y los proyectos superan esta cantidad. Si reservas, que sea sabiendo que la inversión será mayor.
          </span>
        )}
      </label>
      <label className="wide">
        ¿Quién más tiene que dar el visto bueno?
        <input name="decisor" type="text" value={decisor} onChange={(e) => setDecisor(e.target.value)} placeholder="Ej. mi socio Pedro, o «solo yo»" className={c('decisor')} tabIndex={tab} />
      </label>
      {hayOtroDecisor && (
        <label className="chk wide">
          <input type="checkbox" name="conecta" tabIndex={tab} />
          <span>Esa persona podrá conectarse a la llamada</span>
        </label>
      )}
    </>
  )
}

// Casilla obligatoria y sin marcar: la agenda es limitada y no hay segunda reunión si no se presenta sin avisar.
export function Compromiso({ error, tab }: { error?: boolean; tab: 0 | -1 }) {
  return (
    <div className={`compromiso${error ? ' err' : ''}`}>
      <p className="cp-t">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="3" />
          <path d="M8 3v4M16 3v4M3.5 10h17M9 15l2 2 4-4" />
        </svg>
        {COMPROMISO_TIT}
      </p>
      <p className="cp-txt">{COMPROMISO_TXT}</p>
      <label className="chk">
        <input type="checkbox" name="compromiso" tabIndex={tab} />
        <span>{COMPROMISO_CHK}</span>
      </label>
    </div>
  )
}

// Cómo se usan los datos, desplegable dentro del formulario: así quien lo abre no sale de la página ni pierde lo escrito.
export function LegalReserva() {
  return (
    <details className="legal-d">
      <summary>Cómo uso tus datos</summary>
      <p>
        {PRIVACIDAD_TXT}{' '}
        <a href="/privacidad#reservas" target="_blank" rel="noopener">
          Política completa
        </a>
      </p>
    </details>
  )
}
