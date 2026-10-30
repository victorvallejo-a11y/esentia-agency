export type Slot = { t: string; start: string; es?: string }
export type Day = { date: string; slots: Slot[] }

const hora = (d: Date, tz: string) =>
  new Intl.DateTimeFormat('es-ES', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d)
const fecha = (d: Date, tz: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)

// Los huecos llegan en hora de Madrid: se enseñan en la de quien reserva, sin los que le caen de madrugada.
export function aSuZona(days: Day[], tz: string): Day[] {
  const todos = days
    .flatMap((d) => d.slots)
    .map((s) => {
      const d = new Date(s.start)
      return { t: hora(d, tz), start: s.start, es: s.t, date: fecha(d, tz) }
    })
  const despierto = todos.filter((s) => s.t >= '08:00' && s.t <= '21:30')
  const lista = despierto.length ? despierto : todos
  const porDia = new Map<string, Slot[]>()
  for (const { date, ...s } of lista) porDia.set(date, [...(porDia.get(date) ?? []), s])
  return Array.from(porDia, ([date, slots]) => ({ date, slots: slots.sort((a, b) => a.start.localeCompare(b.start)) })).sort((a, b) =>
    a.date.localeCompare(b.date),
  )
}

// "En España son 6 h más": para que nadie se lleve un susto con la hora
export function diferencia(s?: Slot): string {
  if (!s?.es) return ''
  const min = (x: string) => Number(x.slice(0, 2)) * 60 + Number(x.slice(3, 5))
  let d = min(s.es) - min(s.t)
  if (d > 720) d -= 1440
  if (d < -720) d += 1440
  const h = String(Math.abs(d) / 60).replace('.', ',')
  return d ? `En España son ${h} h ${d > 0 ? 'más' : 'menos'}.` : ''
}

export const nombreZona = (tz: string) => (tz.split('/').pop() ?? tz).replace(/_/g, ' ')
