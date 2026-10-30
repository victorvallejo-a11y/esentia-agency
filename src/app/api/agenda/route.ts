import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// Agenda de la web ↔ n8n (flujos "WEB · Agenda · huecos" y "WEB · Agenda · reservar"),
// que leen y escriben en el Google Calendar de victor.vallejo@esentiaagency.es.
// Los límites anti-abuso viven en n8n; aquí solo se filtra lo evidente.
const N8N = 'https://devn8n.esentiaagency.es/webhook'
const TAG = 'agenda'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const r = await fetch(`${N8N}/web-agenda-huecos`, { next: { revalidate: 60, tags: [TAG] }, signal: AbortSignal.timeout(12000) })
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
    business: txt(b.business, 120),
    email: txt(b.email, 120),
    phone: txt(b.phone, 40),
    start: txt(b.start, 40),
    needs: Array.isArray(b.needs) ? b.needs.slice(0, 8).map((n) => txt(n, 40)) : [],
    dedica: txt(b.dedica, 300),
    objetivo: txt(b.objetivo, 300),
    ig: txt(b.ig, 80),
    webEmpresa: txt(b.webEmpresa, 160),
    decisor: txt(b.decisor, 200),
    tz: txt(b.tz, 60),
    ref: txt(b.ref, 200),
    q: txt(b.q, 200),
  }
  if (body.name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(body.email) || !body.start) {
    return NextResponse.json({ ok: false, error: 'datos' }, { status: 400 })
  }

  try {
    const r = await fetch(`${N8N}/web-agenda-reservar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    })
    const j = await r.json().catch(() => null)
    if (j?.ok) {
      revalidateTag(TAG)
      return NextResponse.json({ ok: true, start: j.start, meet: j.meet ?? null })
    }
    const error = ['ocupado', 'limite', 'datos'].includes(j?.error) ? j.error : 'servidor'
    if (error === 'ocupado') revalidateTag(TAG)
    return NextResponse.json({ ok: false, error })
  } catch {
    return NextResponse.json({ ok: false, error: 'servidor' }, { status: 502 })
  }
}
