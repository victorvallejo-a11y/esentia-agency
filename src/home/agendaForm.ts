// Lo comparten la agenda de la home y la página /reserva (la del enlace de Instagram):
// mismos campos, mismas reglas y el mismo compromiso de asistencia.

export type Pais = { n: string; p: string }

export const PAIS_OTRO = 'Otro país'

export const PAISES: Pais[] = [
  { n: 'España', p: '+34' },
  { n: 'México', p: '+52' },
  { n: 'Colombia', p: '+57' },
  { n: 'Argentina', p: '+54' },
  { n: 'Chile', p: '+56' },
  { n: 'Perú', p: '+51' },
  { n: 'Ecuador', p: '+593' },
  { n: 'Guatemala', p: '+502' },
  { n: 'Venezuela', p: '+58' },
  { n: 'Bolivia', p: '+591' },
  { n: 'Paraguay', p: '+595' },
  { n: 'Uruguay', p: '+598' },
  { n: 'Costa Rica', p: '+506' },
  { n: 'Panamá', p: '+507' },
  { n: 'República Dominicana', p: '+1' },
  { n: 'El Salvador', p: '+503' },
  { n: 'Honduras', p: '+504' },
  { n: 'Nicaragua', p: '+505' },
  { n: 'Estados Unidos', p: '+1' },
  { n: 'Portugal', p: '+351' },
  { n: 'Francia', p: '+33' },
  { n: 'Italia', p: '+39' },
  { n: 'Alemania', p: '+49' },
  { n: 'Reino Unido', p: '+44' },
  { n: 'Brasil', p: '+55' },
  { n: PAIS_OTRO, p: '' },
]

const ZONA_PAIS: [RegExp, string][] = [
  [/^(Europe\/Madrid|Atlantic\/Canary|Africa\/Ceuta)/, 'España'],
  [/^America\/(Mexico_City|Monterrey|Merida|Cancun|Tijuana|Chihuahua|Hermosillo|Mazatlan|Bahia_Banderas|Matamoros|Ojinaga)/, 'México'],
  [/^America\/Bogota/, 'Colombia'],
  [/^America\/(Argentina|Buenos_Aires)/, 'Argentina'],
  [/^America\/(Santiago|Punta_Arenas)/, 'Chile'],
  [/^America\/Lima/, 'Perú'],
  [/^America\/Guayaquil/, 'Ecuador'],
  [/^America\/Guatemala/, 'Guatemala'],
  [/^America\/Caracas/, 'Venezuela'],
  [/^America\/La_Paz/, 'Bolivia'],
  [/^America\/Asuncion/, 'Paraguay'],
  [/^America\/Montevideo/, 'Uruguay'],
  [/^America\/Costa_Rica/, 'Costa Rica'],
  [/^America\/Panama/, 'Panamá'],
  [/^America\/Santo_Domingo/, 'República Dominicana'],
  [/^America\/El_Salvador/, 'El Salvador'],
  [/^America\/Tegucigalpa/, 'Honduras'],
  [/^America\/Managua/, 'Nicaragua'],
  [/^Europe\/Lisbon/, 'Portugal'],
  [/^America\/Sao_Paulo/, 'Brasil'],
  [/^Europe\/Paris/, 'Francia'],
  [/^Europe\/Rome/, 'Italia'],
  [/^Europe\/Berlin/, 'Alemania'],
  [/^Europe\/London/, 'Reino Unido'],
]

/** País más probable según la zona horaria del navegador (el usuario siempre puede cambiarlo). */
export const paisPorZona = (tz: string) => ZONA_PAIS.find(([re]) => re.test(tz))?.[1] ?? 'España'

/** "Solo yo", "nadie más", "decido yo"…: no hay nadie más en la decisión. */
export const esSolo = (t: string) => /^\s*(solo|sólo|solamente|nadie|ninguno|ninguna|yo|decido yo|soy yo|no hay nadie)(\s|$|[.,;!])/i.test(t)

export const HORIZONTE_TXT = 'Abro los próximos 3 días hábiles. Si ninguno te encaja, escríbeme por Instagram o WhatsApp.'

export const COMPROMISO_TIT = 'Un compromiso, por respeto al tiempo de los dos'
export const COMPROMISO_TXT =
  'Se bloquea un hueco en mi calendario solo para ti: si no vienes, nadie más podrá usarlo. Si no puedes venir, avísame con al menos 2 horas, respondiendo a la invitación o por Instagram o WhatsApp. Sin aviso, no hay segunda reunión.'
export const COMPROMISO_CHK = 'Lo entiendo y me comprometo a venir'

export const PRIVACIDAD_TXT =
  'Uso tu nombre, email, teléfono y lo que me cuentas de tu empresa solo para esta reunión: reservar el hueco, enviarte la invitación y preparar la llamada. Se guardan en Google Calendar y en mis herramientas de gestión. Puedes pedirme que los borre cuando quieras.'

export type Errores = Partial<Record<'name' | 'email' | 'phone' | 'pais' | 'dedica' | 'plantilla' | 'objetivo' | 'ticket' | 'clientesMes' | 'cuando' | 'decisor' | 'compromiso', boolean>>

export type DatosReserva = {
  name: string
  email: string
  phone: string
  pais: string
  ig: string
  dedica: string
  plantilla: string
  objetivo: string
  ticket: string
  clientesMes: string
  cuando: string
  webEmpresa: string
  decisor: string
  conecta?: boolean
  compromiso: boolean
  website: string
}

/** Lee el formulario, arma el teléfono con prefijo y valida. Los campos obligatorios son todos menos Instagram y web. */
export function leerFormulario(fd: FormData): { data: DatosReserva; errs: Errores; ok: boolean } {
  const g = (k: string) => String(fd.get(k) ?? '').trim()
  const sel = g('pais')
  const otro = sel === PAIS_OTRO
  const pais = otro ? g('paisOtro') : sel
  const prefijo = otro ? g('prefijoOtro').replace(/\D/g, '').replace(/^/, '+') : (PAISES.find((p) => p.n === sel)?.p ?? '')
  let num = g('phone')
  if (num.startsWith('00')) num = '+' + num.slice(2)
  const phone = num.startsWith('+') ? num : `${prefijo === '+' ? '' : prefijo} ${num.replace(/^0+/, '')}`.trim()
  const decisor = g('decisor')
  const data: DatosReserva = {
    name: g('name'),
    email: g('email'),
    phone,
    pais,
    ig: g('ig'),
    dedica: g('dedica'),
    plantilla: g('plantilla'),
    objetivo: g('objetivo'),
    ticket: g('ticket'),
    clientesMes: g('clientesMes'),
    cuando: g('cuando'),
    webEmpresa: g('webEmpresa'),
    decisor,
    conecta: decisor.length >= 2 && !esSolo(decisor) ? fd.get('conecta') === 'on' : undefined,
    compromiso: fd.get('compromiso') === 'on',
    website: String(fd.get('website') ?? ''),
  }
  const digitos = phone.replace(/\D/g, '').length
  const errs: Errores = {
    name: data.name.length < 2,
    email: !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(data.email),
    phone: digitos < 9 || digitos > 15,
    pais: data.pais.length < 2,
    dedica: data.dedica.length < 3,
    plantilla: !data.plantilla,
    objetivo: data.objetivo.length < 3,
    ticket: !data.ticket,
    clientesMes: !data.clientesMes,
    cuando: data.cuando.length < 2,
    decisor: decisor.length < 2,
    compromiso: !data.compromiso,
  }
  return { data, errs, ok: !Object.values(errs).some(Boolean) }
}

/** Parámetros de la URL que el formulario reenvía: r = enlace firmado del bot, test = reserva de prueba. */
export function leerUrl() {
  if (typeof window === 'undefined') return { r: '', test: '' }
  const q = new URLSearchParams(window.location.search)
  return { r: (q.get('r') || '').slice(0, 80), test: (q.get('test') || '').slice(0, 60) }
}
