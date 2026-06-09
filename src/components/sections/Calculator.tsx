'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import RevealOnScroll from '@/components/shared/RevealOnScroll'
import MagneticButton from '@/components/shared/MagneticButton'
import { ArrowRight, Clock, TrendingDown, PhoneCall, MessageSquare, TrendingUp } from 'lucide-react'

const questions = [
  {
    id: 'hours',
    text: '¿Cuántas horas al día dedica tu equipo a gestionar clientes manualmente? (responder, seguimiento, agendar...)',
    options: [
      { label: 'Menos de 1h', value: 0.5 },
      { label: '1 a 3h', value: 2 },
      { label: '3 a 6h', value: 4.5 },
      { label: 'Más de 6h — es agotador', value: 7 },
    ],
  },
  {
    id: 'missedCalls',
    text: '¿Cuántas llamadas se quedan sin atender al momento cada día? (clientes que llaman y no hay nadie libre)',
    options: [
      { label: '1 o 2', value: 1.5 },
      { label: '3 a 5', value: 4 },
      { label: '5 a 8', value: 6.5 },
      { label: 'Más de 8 — es un problema real', value: 10 },
    ],
  },
  {
    id: 'missedMessages',
    text: '¿Cuántos mensajes recibes al día (WhatsApp, email, formulario web) sin responder en menos de 1 hora?',
    options: [
      { label: '1 a 5', value: 3 },
      { label: '5 a 10', value: 7 },
      { label: '10 a 20', value: 15 },
      { label: 'Más de 20', value: 25 },
    ],
  },
  {
    id: 'ticket',
    text: '¿Cuál es el valor medio de lo que paga un cliente tuyo?',
    options: [
      { label: 'Menos de 100 €', value: 70 },
      { label: '100 € a 500 €', value: 250 },
      { label: '500 € a 1.500 €', value: 900 },
      { label: 'Más de 1.500 €', value: 2000 },
    ],
  },
  {
    id: 'followup',
    text: '¿Tienes algún sistema automático que haga seguimiento a los leads que no compraron de inmediato?',
    options: [
      { label: 'Sí, funciona bien', value: 0 },
      { label: 'Sí, pero falla o no lo uso', value: 0.6 },
      { label: 'No tengo nada', value: 1.0 },
      { label: '¿Qué es un lead?', value: 1.3 },
    ],
  },
  {
    id: 'team',
    text: '¿Cuántas personas en tu empresa dedican tiempo a atención al cliente?',
    options: [
      { label: 'Solo yo', value: 1 },
      { label: '1 o 2 personas más', value: 1.5 },
      { label: '3 a 5 personas', value: 3 },
      { label: 'Más de 5', value: 5 },
    ],
  },
]

const schema = z.object({
  name: z.string().min(2, 'Introduce tu nombre'),
  phone: z.string().min(9, 'Teléfono válido'),
  email: z.string().email('Email no válido'),
  consent: z.boolean(),
})
type FormData = z.infer<typeof schema>
type Phase = 'questions' | 'contact' | 'result'

function calcResults(ans: number[]) {
  const [hoursDay, missedCallsDay, missedMsgDay, ticket, noFollowup, teamSize] = ans

  // Horas perdidas al mes (toda la plantilla)
  const hoursMonth = Math.round(hoursDay * 22 * teamSize)

  // Oportunidades perdidas al mes
  const missedCallsMonth = Math.round(missedCallsDay * 22)
  const missedMsgMonth   = Math.round(missedMsgDay * 22)

  // Lógica realista:
  // Llamadas: ~35% no vuelven a llamar. De esos, ~20% habrían comprado → 7% del total
  // Mensajes:  ~25% no siguen. De esos, ~12% habrían comprado → 3% del total
  // Multiplicador de follow-up: sin sistema se pierde un 20-40% adicional
  const followupMult = noFollowup > 0 ? 1 + noFollowup * 0.25 : 1
  const costLost = Math.round(
    (missedCallsMonth * 0.07 * ticket + missedMsgMonth * 0.03 * ticket) * followupMult
  )

  // ROI: inversión media ~1.200 €
  const returnMonths = Math.max(1, Math.round(1200 / Math.max(costLost, 200)))

  return { hoursMonth, costLost, missedCallsMonth, missedMsgMonth, returnMonths }
}

export default function Calculator() {
  const [phase, setPhase]       = useState<Phase>('questions')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers]   = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState({
    hoursMonth: 0, costLost: 0, missedCallsMonth: 0, missedMsgMonth: 0, returnMonths: 1,
  })

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const handleAnswer = (value: number) => {
    const next = [...answers, value]
    setAnswers(next)
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 320)
    } else {
      setTimeout(() => setPhase('contact'), 350)
    }
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)

    // Calcular resultados antes de enviar para incluirlos en el email
    const res = calcResults(answers)

    try {
      await fetch('https://formspree.io/f/mgobylvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre: data.name,
          telefono: data.phone,
          email: data.email,
          horas_perdidas_mes: `${res.hoursMonth}h`,
          coste_estimado_mes: `~${res.costLost.toLocaleString('es-ES')}€`,
          llamadas_sin_atender_mes: `~${res.missedCallsMonth}`,
          mensajes_sin_respuesta_mes: `~${res.missedMsgMonth}`,
          retorno_estimado: res.returnMonths === 1 ? 'menos de 1 mes' : `${res.returnMonths} meses`,
        }),
      })
    } catch (e) {
      console.error('Formspree error:', e)
    }

    setResults(res)
    setPhase('result')
    setSubmitting(false)
  }

  const costColor =
    results.costLost < 1000  ? 'text-emerald-400' :
    results.costLost < 5000  ? 'text-amber-400'   : 'text-red-400'

  return (
    <section
      id="calculadora"
      className="relative bg-[#111111] text-white overflow-hidden min-h-screen flex flex-col justify-center py-16"
    >
      {/* Glow central teal */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(15,118,110,0.22) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <RevealOnScroll direction="scale" className="mb-10 text-center">
          <p className="text-[12px] font-inter uppercase tracking-[0.15em] text-[#2DD4BF] mb-4">Diagnóstico gratuito</p>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-inter font-semibold leading-tight tracking-[-0.02em]">
            ¿Cuánto te está costando<br/><span className="text-[#2DD4BF]">no automatizar?</span>
          </h2>
        </RevealOnScroll>

        <div className="max-w-2xl mx-auto">
          <div className="bg-[#161616] rounded-2xl border border-white/[0.06] overflow-hidden">

            {/* Progress */}
            {phase === 'questions' && (
              <div className="h-0.5 bg-white/[0.05]">
                <div className="h-full bg-[#0F766E] transition-all duration-500"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}/>
              </div>
            )}

            <div className="p-6 md:p-10">

              {/* PHASE 1 — Preguntas */}
              {phase === 'questions' && (
                <div key={currentQ} style={{animation:'slideIn 0.38s cubic-bezier(0.16,1,0.3,1)'}}>
                  <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}`}</style>
                  <p className="text-[11px] font-mono text-[#0F766E] uppercase tracking-widest mb-5">
                    {currentQ + 1} / {questions.length}
                  </p>
                  <h3 className="text-[clamp(1rem,2.5vw,1.35rem)] font-inter font-semibold text-white leading-snug mb-7">
                    {questions[currentQ].text}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {questions[currentQ].options.map((opt, i) => (
                      <button key={i} onClick={() => handleAnswer(opt.value)}
                        className="text-left px-5 py-4 rounded-xl border border-white/[0.07] hover:border-[#0F766E] hover:bg-[#0F766E]/10 text-[13px] font-inter text-white/70 hover:text-white transition-all duration-200 cursor-pointer">
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PHASE 2 — Contacto */}
              {phase === 'contact' && (
                <div style={{animation:'slideIn 0.38s cubic-bezier(0.16,1,0.3,1)'}}>
                  <h3 className="text-[clamp(1.2rem,2.5vw,1.6rem)] font-inter font-semibold text-white mb-2">
                    Tu diagnóstico está listo
                  </h3>
                  <p className="text-[14px] font-inter text-white/50 mb-7">
                    Déjanos tus datos y te lo enviamos en menos de 24h
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                      <label className="sr-only" htmlFor="name">Nombre</label>
                      <input id="name" {...register('name')} placeholder="Tu nombre"
                        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white placeholder-white/25 text-[14px] font-inter focus:outline-none focus:border-[#0F766E] transition-colors"/>
                      {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="sr-only" htmlFor="phone">Teléfono</label>
                      <input id="phone" {...register('phone')} placeholder="+34 711 237 051"
                        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white placeholder-white/25 text-[14px] font-inter focus:outline-none focus:border-[#0F766E] transition-colors"/>
                      {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="sr-only" htmlFor="email">Email</label>
                      <input id="email" {...register('email')} placeholder="tu@email.com" type="email"
                        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white placeholder-white/25 text-[14px] font-inter focus:outline-none focus:border-[#0F766E] transition-colors"/>
                      {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>}
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" {...register('consent')}
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-[#0F766E]"/>
                      <span className="text-[13px] font-inter text-white/55 leading-snug">
                        Quiero ser contactado para recibir una propuesta personalizada
                      </span>
                    </label>
                    <MagneticButton type="submit"
                      className="mt-1 w-full py-4 bg-[#0F766E] text-white text-[14px] font-inter font-medium rounded-xl flex items-center justify-center gap-2 glow-pulse hover:bg-[#0d6960] transition-colors cursor-pointer">
                      {submitting
                        ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                        : <><span>Ver mi diagnóstico</span><ArrowRight size={15}/></>
                      }
                    </MagneticButton>
                    <p className="text-center text-[11px] font-inter text-white/25">Sin spam. Te contactamos solo si tú quieres avanzar.</p>
                  </form>
                </div>
              )}

              {/* PHASE 3 — Resultado */}
              {phase === 'result' && (
                <div style={{animation:'revealScale 0.6s cubic-bezier(0.34,1.56,0.64,1)'}}>
                  <style>{`@keyframes revealScale{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}`}</style>

                  <p className="text-[10px] font-mono text-[#2DD4BF] uppercase tracking-widest mb-4">
                    Estimación aproximada · basada en tus respuestas
                  </p>

                  {/* 4 métricas en 2×2 — compactas */}
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    <div className="bg-white/[0.04] rounded-xl p-3 text-center">
                      <Clock size={13} className="mx-auto mb-1.5 text-[#2DD4BF]"/>
                      <div className="font-mono font-semibold text-[#2DD4BF] text-[1.45rem] leading-none mb-0.5">
                        {results.hoursMonth}h
                      </div>
                      <p className="text-[10px] font-inter text-white/35 leading-snug">horas manuales/mes</p>
                    </div>

                    <div className="bg-white/[0.04] rounded-xl p-3 text-center">
                      <TrendingDown size={13} className="mx-auto mb-1.5 text-[#2DD4BF]"/>
                      <div className={`font-mono font-semibold text-[1.45rem] leading-none mb-0.5 ${costColor}`}>
                        ~{results.costLost.toLocaleString('es-ES')}€
                      </div>
                      <p className="text-[10px] font-inter text-white/35 leading-snug">coste clientes perdidos/mes</p>
                    </div>

                    <div className="bg-white/[0.04] rounded-xl p-3 text-center">
                      <PhoneCall size={13} className="mx-auto mb-1.5 text-[#2DD4BF]"/>
                      <div className="font-mono font-semibold text-[#2DD4BF] text-[1.45rem] leading-none mb-0.5">
                        ~{results.missedCallsMonth}
                      </div>
                      <p className="text-[10px] font-inter text-white/35 leading-snug">llamadas sin atender/mes</p>
                    </div>

                    <div className="bg-white/[0.04] rounded-xl p-3 text-center">
                      <MessageSquare size={13} className="mx-auto mb-1.5 text-[#2DD4BF]"/>
                      <div className="font-mono font-semibold text-[#2DD4BF] text-[1.45rem] leading-none mb-0.5">
                        ~{results.missedMsgMonth}
                      </div>
                      <p className="text-[10px] font-inter text-white/35 leading-snug">mensajes sin respuesta/mes</p>
                    </div>
                  </div>

                  {/* ROI box */}
                  <div className="rounded-xl border border-[#0F766E]/35 bg-[#0F766E]/[0.07] p-3.5 mb-4">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <TrendingUp size={12} className="text-[#2DD4BF]"/>
                      <p className="text-[10px] font-mono text-[#2DD4BF] uppercase tracking-wider">Retorno estimado</p>
                    </div>
                    <p className="text-[13px] font-inter text-white font-semibold">
                      Recuperas la inversión en{' '}
                      <span className="text-[#2DD4BF]">
                        {results.returnMonths === 1 ? 'menos de 1 mes' : `${results.returnMonths} meses`}
                      </span>
                    </p>
                    <p className="text-[10px] font-inter text-white/25 mt-1">
                      Cálculo conservador. Los resultados reales dependen del sector y el negocio.
                    </p>
                  </div>

                  <div className="border-t border-white/[0.06] pt-4 text-center">
                    <p className="text-[12px] font-inter text-white/50 mb-3">
                      ¿Quieres recuperar ese tiempo y ese dinero?
                    </p>
                    <MagneticButton
                      href="https://wa.me/34711237051"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#0F766E] text-white text-[13px] font-inter font-medium rounded-xl glow-pulse hover:bg-[#0d6960] transition-colors">
                      Hablar con un experto <ArrowRight size={14}/>
                    </MagneticButton>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
