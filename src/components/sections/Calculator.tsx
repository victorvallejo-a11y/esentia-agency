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
    text: '¿Cuántas horas al día inviertes tú o tu equipo en gestionar clientes manualmente? (responder, hacer seguimiento, agendar...)',
    options: [
      { label: 'Menos de 1h', value: 0.5 },
      { label: '1 a 3h', value: 2 },
      { label: '3 a 6h', value: 4.5 },
      { label: 'Más de 6h — es agotador', value: 7 },
    ],
  },
  {
    id: 'missedCalls',
    text: '¿Cuántas llamadas se quedan sin atender al momento cada día? (clientes que llaman y no hay nadie disponible)',
    options: [
      { label: '1 o 2 — tampoco mucho', value: 1.5 },
      { label: '3 a 5', value: 4 },
      { label: '6 a 10', value: 8 },
      { label: 'Más de 10 — es un problema', value: 13 },
    ],
  },
  {
    id: 'missedMessages',
    text: '¿Cuántos mensajes recibes al día (WhatsApp, email, web) sin responder en menos de 1 hora?',
    options: [
      { label: '1 a 5', value: 3 },
      { label: '5 a 15', value: 10 },
      { label: '15 a 30', value: 22 },
      { label: 'Más de 30 — imposible responder todo', value: 40 },
    ],
  },
  {
    id: 'ticket',
    text: '¿Cuál es el valor medio de lo que paga un cliente tuyo?',
    options: [
      { label: 'Menos de 100 €', value: 70 },
      { label: '100 € a 500 €', value: 280 },
      { label: '500 € a 2.000 €', value: 1100 },
      { label: 'Más de 2.000 €', value: 3000 },
    ],
  },
  {
    id: 'followup',
    text: '¿Tienes algún sistema automático que haga seguimiento a los leads que no compraron de inmediato?',
    options: [
      { label: 'Sí, funciona bien', value: 0 },
      { label: 'Sí, pero falla o no lo uso', value: 0.7 },
      { label: 'No tengo nada', value: 1.2 },
      { label: '¿Qué es un lead?', value: 1.5 },
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

  // Coste estimado: llamadas convierten ~25%, mensajes ~10%
  // El multiplicador de follow-up refleja cuánto más se pierde sin sistema
  const multiplier = noFollowup > 0 ? 1 + noFollowup * 0.35 : 1
  const costLost = Math.round(
    (missedCallsMonth * 0.25 * ticket + missedMsgMonth * 0.10 * ticket) * multiplier
  )

  // ROI: estimamos inversión media de 1.500 €
  const returnMonths = Math.max(1, Math.round(1500 / Math.max(costLost, 300)))

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
    await new Promise(r => setTimeout(r, 700))
    setResults(calcResults(answers))
    setPhase('result')
    setSubmitting(false)
    console.log('Lead:', data)
  }

  const costColor =
    results.costLost < 1000  ? 'text-emerald-400' :
    results.costLost < 5000  ? 'text-amber-400'   : 'text-red-400'

  return (
    <section
      id="calculadora"
      className="relative text-white overflow-hidden min-h-screen flex flex-col justify-center py-16"
      style={{ zIndex: 1 }}
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
                <div style={{animation:'revealScale 0.8s cubic-bezier(0.34,1.56,0.64,1)'}}>
                  <style>{`@keyframes revealScale{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}`}</style>

                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[11px] font-mono text-[#2DD4BF] uppercase tracking-widest">Estimación aproximada</p>
                    <span className="text-[10px] font-inter text-white/25">Basado en tus respuestas</span>
                  </div>

                  {/* 4 métricas en 2×2 */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/[0.03] rounded-xl p-4 text-center">
                      <Clock size={16} className="mx-auto mb-2 text-[#2DD4BF]"/>
                      <div className="font-mono font-semibold text-[#2DD4BF] text-[1.9rem] leading-none mb-1">
                        {results.hoursMonth}h
                      </div>
                      <p className="text-[11px] font-inter text-white/40 leading-snug">horas manuales<br/>perdidas al mes</p>
                    </div>

                    <div className="bg-white/[0.03] rounded-xl p-4 text-center">
                      <TrendingDown size={16} className="mx-auto mb-2 text-[#2DD4BF]"/>
                      <div className={`font-mono font-semibold text-[1.9rem] leading-none mb-1 ${costColor}`}>
                        ~{results.costLost.toLocaleString('es-ES')} €
                      </div>
                      <p className="text-[11px] font-inter text-white/40 leading-snug">coste estimado de<br/>clientes perdidos/mes</p>
                    </div>

                    <div className="bg-white/[0.03] rounded-xl p-4 text-center">
                      <PhoneCall size={16} className="mx-auto mb-2 text-[#2DD4BF]"/>
                      <div className="font-mono font-semibold text-[#2DD4BF] text-[1.9rem] leading-none mb-1">
                        ~{results.missedCallsMonth}
                      </div>
                      <p className="text-[11px] font-inter text-white/40 leading-snug">llamadas sin atender<br/>al mes</p>
                    </div>

                    <div className="bg-white/[0.03] rounded-xl p-4 text-center">
                      <MessageSquare size={16} className="mx-auto mb-2 text-[#2DD4BF]"/>
                      <div className="font-mono font-semibold text-[#2DD4BF] text-[1.9rem] leading-none mb-1">
                        ~{results.missedMsgMonth}
                      </div>
                      <p className="text-[11px] font-inter text-white/40 leading-snug">mensajes sin respuesta<br/>a tiempo al mes</p>
                    </div>
                  </div>

                  {/* ROI box */}
                  <div className="rounded-xl border border-[#0F766E]/40 bg-[#0F766E]/[0.08] p-4 mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={14} className="text-[#2DD4BF]"/>
                      <p className="text-[11px] font-mono text-[#2DD4BF] uppercase tracking-wider font-medium">Retorno estimado</p>
                    </div>
                    <p className="text-[14px] font-inter text-white font-semibold">
                      Recuperas la inversión en{' '}
                      <span className="text-[#2DD4BF]">
                        {results.returnMonths === 1 ? 'menos de 1 mes' : `${results.returnMonths} meses`}
                      </span>
                    </p>
                    <p className="text-[11px] font-inter text-white/30 mt-1">
                      Estimación conservadora. Resultados reales varían según sector y modelo de negocio.
                    </p>
                  </div>

                  <div className="border-t border-white/[0.06] pt-5 text-center">
                    <p className="text-[13px] font-inter text-white/55 mb-4">
                      ¿Quieres recuperar ese tiempo y ese dinero?
                    </p>
                    <MagneticButton
                      href="https://wa.me/34711237051"
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0F766E] text-white text-[14px] font-inter font-medium rounded-xl glow-pulse hover:bg-[#0d6960] transition-colors">
                      Hablar con un experto <ArrowRight size={15}/>
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
