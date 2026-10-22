'use client'
import { useEffect, useRef, useState } from 'react'
import { Btn, fmtN } from './ui'

type Field = { key: string; label: string; min: number; max: number; step: number; def: number; fmt: (v: number) => string }
type Area = {
  id: string
  tab: string
  title: string
  fields: Field[]
  calc: (v: Record<string, number>) => number
  formula: string
  extra?: (v: Record<string, number>) => string
  real?: string
}

const eur = (n: number) => `${fmtN(n)} €`

const AREAS: Area[] = [
  {
    id: 'atencion',
    tab: 'Atención',
    title: 'Clientes que preguntan y nadie contesta a tiempo.',
    fields: [
      { key: 'n', label: 'Consultas sin respuesta a tiempo, al mes', min: 5, max: 300, step: 5, def: 40, fmt: (v) => `${v}` },
      { key: 'k', label: 'De cada 10, cuántas habrían comprado', min: 1, max: 8, step: 1, def: 3, fmt: (v) => `${v} de 10` },
      { key: 't', label: 'Ticket medio', min: 20, max: 1500, step: 10, def: 120, fmt: (v) => eur(v) },
    ],
    calc: (v) => v.n * (v.k / 10) * v.t,
    formula: 'Consultas sin respuesta × las que habrían comprado × tu ticket.',
    extra: (v) => `${Math.round(v.n * (v.k / 10))} ventas al mes que se lleva otro`,
  },
  {
    id: 'pedidos',
    tab: 'Pedidos',
    title: 'Pedidos que se copian a mano y se tuercen.',
    fields: [
      { key: 'p', label: 'Pedidos al día', min: 5, max: 300, step: 5, def: 60, fmt: (v) => `${v}` },
      { key: 'e', label: 'Con error u olvido, de cada 100', min: 1, max: 10, step: 1, def: 3, fmt: (v) => `${v} de 100` },
      { key: 'c', label: 'Lo que te cuesta cada error', min: 10, max: 300, step: 5, def: 40, fmt: (v) => eur(v) },
    ],
    calc: (v) => v.p * 22 * (v.e / 100) * v.c,
    formula: 'Pedidos × 22 días × los que salen mal × lo que cuesta cada uno.',
    extra: (v) => `${Math.round(v.p * 22 * (v.e / 100))} pedidos torcidos al mes`,
  },
  {
    id: 'admin',
    tab: 'Administración',
    title: 'Horas tecleando, copiando y cuadrando papeles.',
    fields: [
      { key: 'p', label: 'Personas que lo hacen', min: 1, max: 15, step: 1, def: 2, fmt: (v) => `${v}` },
      { key: 'h', label: 'Horas a la semana, por persona', min: 1, max: 25, step: 1, def: 6, fmt: (v) => `${v} h` },
      { key: 'c', label: 'Lo que vale una hora de su trabajo', min: 12, max: 90, step: 1, def: 22, fmt: (v) => eur(v) },
    ],
    calc: (v) => v.p * v.h * 4.33 * v.c,
    formula: 'Personas × horas a la semana × 4,33 semanas × lo que vale su hora.',
    extra: (v) => `${Math.round(v.p * v.h * 4.33)} h al mes que podrían ir a vender o atender`,
    real: 'Caso real · Clínica Dra. Janice Middleton: 46 h y 3.284 € al mes.',
  },
]

function useTween(target: number) {
  const [shown, setShown] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    const start = performance.now()
    const a = from.current
    let raf = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 420)
      const e = 1 - Math.pow(1 - p, 3)
      const v = a + (target - a) * e
      setShown(v)
      from.current = v
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return shown
}

export default function Calculadora() {
  const [areaId, setAreaId] = useState(AREAS[0].id)
  const area = AREAS.find((a) => a.id === areaId)!
  const [vals, setVals] = useState<Record<string, Record<string, number>>>(() =>
    Object.fromEntries(AREAS.map((a) => [a.id, Object.fromEntries(a.fields.map((f) => [f.key, f.def]))])),
  )
  const v = vals[areaId]
  const month = area.calc(v)
  const shown = useTween(month)

  return (
    <section className="calc" id="calculadora" aria-label="Calculadora">
      <div className="wrap">
        <div className="bz bz-d rv">
          <div className="bz-in calc-box">
            <div className="calc-l">
              <h3>Ponle precio a tu cuello de botella.</h3>
              <div className="seg" role="tablist" aria-label="Área">
                {AREAS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    role="tab"
                    aria-selected={a.id === areaId}
                    className={a.id === areaId ? 'on' : ''}
                    onClick={() => setAreaId(a.id)}
                  >
                    {a.tab}
                  </button>
                ))}
              </div>
              <p className="calc-t">{area.title}</p>
              {area.fields.map((f) => {
                const val = v[f.key]
                const pct = ((val - f.min) / (f.max - f.min)) * 100
                return (
                  <label className="fld" key={`${area.id}-${f.key}`}>
                    <span className="lab">
                      <span>{f.label}</span>
                      <b>{f.fmt(val)}</b>
                    </span>
                    <input
                      type="range"
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={val}
                      style={{ ['--p' as string]: `${pct}%` }}
                      onChange={(e) =>
                        setVals((s) => ({ ...s, [area.id]: { ...s[area.id], [f.key]: Number(e.target.value) } }))
                      }
                    />
                  </label>
                )
              })}
            </div>
            <div className="calc-r" aria-live="polite">
              <span className="k">Se te escapa, cada mes</span>
              <div className="big">
                <span>{fmtN(shown)}</span>
                <small>€</small>
              </div>
              <p className="eq">
                <b>{eur(month * 12)}</b> al año · {area.extra?.(v)}
              </p>
              <p className="fx">{area.formula}</p>
              {area.real && <p className="real">{area.real}</p>}
              <Btn href="#agenda">Quiero recuperarlo</Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
