import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// Agenda de la web ↔ n8n (flujos "WEB · Agenda · huecos" y "WEB · Agenda · reservar"),
// que leen y escriben en el Google Calendar de victor.vallejo@esentiaagency.es.
// La usan la agenda de la home y la página /reserva (enlace de Instagram).
// Los límites anti-abuso viven en n8n; aquí solo se filtra lo evidente.
const N8N = 'https://devn8n.esentiaagency.es/webhook'
const TAG = 'agenda'

// En local (localhost) se usan las copias de pruebas de los flujos (sufijo -v2); en producción, los de verdad.
const sufijo = (req: Request) => {
  try {
    return new URL(req.url).hostname === 'localhost' ? '-v2' : ''
  } catch {
    return ''
  }
}

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const r = await fetch(`${N8N}/web-agenda-huecos${sufijo(req)}`, { next: { revalidate: 60, tags: [TAG] }, signal: AbortSignal.timeout(12000) })
    if (!r.ok) throw new Error(String(r.status))
    const j = await r.json()
    if (!j.ok) throw new Error('n8n')
    return NextResponse.json({ ok: true, days: j.days ?? [] }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ ok: false, days: [] }, { status: 502, headers: { 'Cache-Control': 'no-store' } })
  }
}

const txt = (x: unknown, n: number) => String(x ?? '').trim().slice(0, n)

export async function POST(req: Request) {
  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'datos' }, { status: 400 })
  }
  // Campo trampa: los bots lo rellenan, las personas no lo ven.
  if (txt(b.website, 200)) return NextResponse.json({ ok: true })

  const body = {
    name: txt(b.name, 80),
    email: txt(b.email, 120),
    phone: txt(b.phone, 40),
    pais: txt(b.pais, 60),
    ig: txt(b.ig, 80),
    dedica: txt(b.dedica, 300),
    plantilla: txt(b.plantilla, 60),
    objetivo: txt(b.objetivo, 400),
    ticket: txt(b.ticket, 80),
    clientesMes: txt(b.clientesMes, 60),
    cuando: txt(b.cuando, 120),
    webEmpresa: txt(b.webEmpresa, 160),
    decisor: txt(b.decisor, 200),
    conecta: typeof b.conecta === 'boolean' ? b.conecta : undefined,
    compromiso: b.compromiso === true,
    start: txt(b.start, 40),
    tz: txt(b.tz, 60),
    ref: txt(b.ref, 200),
    q: txt(b.q, 200),
    // enlace firmado que manda el bot por Instagram (n8n comprueba la firma) y reserva de prueba (n8n comprueba la clave)
    r: txt(b.r, 80),
    test: txt(b.test, 60),
  }
  const digitos = body.phone.replace(/\D/g, '').length
  if (
    body.name.length < 2 ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(body.email) ||
    digitos < 9 ||
    digitos > 15 ||
    !body.start ||
    !body.compromiso ||
    body.dedica.length < 3 ||
    !body.plantilla ||
    body.objetivo.length < 3 ||
    !body.ticket ||
    !body.clientesMes ||
    body.cuando.length < 2 ||
    body.decisor.length < 2 ||
    body.pais.length < 2
  ) {
    return NextResponse.json({ ok: false, error: 'datos' }, { status: 400 })
  }

  try {
    const r = await fetch(`${N8N}/web-agenda-reservar${sufijo(req)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    })
    const j = await r.json().catch(() => null)
    if (j?.ok) {
      revalidateTag(TAG)
      return NextResponse.json({ ok: true, start: j.start, meet: j.meet ?? null, test: j.test === true })
    }
    const error = ['ocupado', 'limite', 'datos'].includes(j?.error) ? j.error : 'servidor'
    if (error === 'ocupado') revalidateTag(TAG)
    return NextResponse.json({ ok: false, error })
  } catch {
    return NextResponse.json({ ok: false, error: 'servidor' }, { status: 502 })
  }
}
