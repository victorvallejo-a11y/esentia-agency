'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import RevealOnScroll from '@/components/shared/RevealOnScroll'
import MagneticButton from '@/components/shared/MagneticButton'
import { ArrowRight, Clock, TrendingDown, PhoneCall, TrendingUp } from 'lucide-react'


const questions = [
  {
    id: 'hours',
    text: 'Cuantas horas al dia dedicas a responder clientes?',
    options: [{ label: 'Menos de 1h', value: 0.5 },{ label: '1-3h', value: 2 },{ label: '3-5h', value: 4 },{ label: 'Mas de 5h', value: 6 }],
  },
  {
    id: 'missed',
    text: 'Cuantas llamadas o mensajes te quedan sin responder a la semana?',
    options: [{ label: 'Casi ninguna', value: 2 },{ label: '5-10', value: 7 },{ label: '10-25', value: 17 },{ label: 'Mas de 25', value: 35 }],
  },
  {
    id: 'ticket',
    text: 'Cual es el valor medio de venta por cliente?',
    options: [{ label: 'Menos de 50', value: 35 },{ label: '50-150', value: 100 },{ label: '150-500', value: 300 },{ label: 'Mas de 500', value: 700 }],
  },
  {
    id: 'followup',
    text: 'Tienes sistema automatico de seguimiento de leads?',
    options: [{ label: 'Si', value: 0 },{ label: 'No', value: 1 },{ label: 'No se que es eso', value: 1.5 }],
  },
  {
    id: 'team',
    text: 'Cuantos empleados gestionan atencion al cliente?',
    options: [{ label: 'Solo yo', value: 1 },{ label: '1-2', value: 1.5 },{ label: '3-5', value: 3 },{ label: 'Mas de 5', value: 5 }],
  },
]

const schema = z.object({
  name: z.string().min(2, 'Introduce tu nombre'),
  phone: z.string().min(9, 'Telefono valido'),
  email: z.string().email('Email no valido'),
  consent: z.boolean(),
})
type FormData = z.infer<typeof schema>
type Phase = 'questions' | 'contact' | 'result'

function calcResults(ans: number[]) {
  const [hoursDay, missedWeek, ticket, noFollowup, teamSize] = ans
  const hoursMonth = Math.round(hoursDay * 22 * teamSize)
  const missedMonth = Math.round(missedWeek * 4.3)
  const convRate = 0.18
  const multiplier = noFollowup > 0 ? 1.35 : 1
  const costLost = Math.round(missedMonth * convRate * ticket * multiplier)
  const missedCalls = Math.round(missedWeek * 4.3 * 0.4)
  const returnMonths = Math.max(1, Math.round(800 / Math.max(costLost, 100)))
  return { hoursMonth, costLost, missedCalls, returnMonths }
}

export default function Calculator() {
  const [phase, setPhase] = useState<Phase>('questions')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState({ hoursMonth: 0, costLost: 0, missedCalls: 0, returnMonths: 1 })

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

  const costColor = results.costLost < 500 ? 'text-emerald-400' : results.costLost < 2000 ? 'text-amber-400' : 'text-red-400'

  return (
    <section id="calculadora" className="relative bg-[#080d0c] text-white overflow-hidden h-screen flex flex-col justify-center">
      {/* Glow central teal */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(15,118,110,0.22) 0%, transparent 70%)' }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <RevealOnScroll direction="scale" className="mb-14 text-center">
          <p className="text-[12px] font-inter uppercase tracking-[0.15em] text-[#2DD4BF] mb-4">Diagnostico gratuito</p>
          <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-inter font-semibold leading-tight tracking-[-0.02em]">
            Cuanto te esta costando<br/><span className="text-[#2DD4BF]">no automatizar</span>
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

            <div className="p-8 md:p-12">

              {/* PHASE 1 */}
              {phase === 'questions' && (
                <div key={currentQ} style={{animation:'slideIn 0.38s cubic-bezier(0.16,1,0.3,1)'}}>
                  <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}`}</style>
                  <p className="text-[11px] font-mono text-[#0F766E] uppercase tracking-widest mb-5">
                    {currentQ + 1} / {questions.length}
                  </p>
                  <h3 className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-inter font-semibold text-white leading-snug mb-8">
                    {questions[currentQ].text}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {questions[currentQ].options.map((opt, i) => (
                      <button key={i} onClick={() => handleAnswer(opt.value)}
                        className="text-left px-5 py-4 rounded-xl border border-white/[0.07] hover:border-[#0F766E] hover:bg-[#0F766E]/05 text-[14px] font-inter text-white/75 hover:text-white transition-all duration-200 cursor-pointer">
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PHASE 2 */}
              {phase === 'contact' && (
                <div style={{animation:'slideIn 0.38s cubic-bezier(0.16,1,0.3,1)'}}>
                  <h3 className="text-[clamp(1.2rem,2.5vw,1.6rem)] font-inter font-semibold text-white mb-2">
                    Tu diagnostico esta listo
                  </h3>
                  <p className="text-[14px] font-inter text-white/50 mb-7">
                    Dejanos tus datos y te lo enviamos en menos de 24h
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                      <label className="sr-only" htmlFor="name">Nombre</label>
                      <input id="name" {...register('name')} placeholder="Tu nombre"
                        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white placeholder-white/25 text-[14px] font-inter focus:outline-none focus:border-[#0F766E] transition-colors"/>
                      {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="sr-only" htmlFor="phone">Telefono</label>
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
                        : <><span>Ver mi diagnostico</span><ArrowRight size={15}/></>
                      }
                    </MagneticButton>
                    <p className="text-center text-[11px] font-inter text-white/25">Sin spam. Te contactamos solo si tu quieres avanzar.</p>
                  </form>
                </div>
              )}

              {/* PHASE 3 — Desglose */}
              {phase === 'result' && (
                <div style={{animation:'revealScale 0.8s cubic-bezier(0.34,1.56,0.64,1)'}}>
                  <style>{`@keyframes revealScale{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}`}</style>
                  <p className="text-[11px] font-mono text-[#2DD4BF] uppercase tracking-widest mb-6">DESGLOSE</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
                    <div className="text-center">
                      <Clock size={18} className="mx-auto mb-2 text-[#2DD4BF]"/>
                      <div className="font-mono font-medium text-[#2DD4BF] text-[2.2rem] leading-none mb-1">
                        {results.hoursMonth}h
                      </div>
                      <p className="text-[12px] font-inter text-white/45">horas perdidas al mes</p>
                    </div>
                    <div className="text-center">
                      <TrendingDown size={18} className="mx-auto mb-2 text-[#2DD4BF]"/>
                      <div className={`font-mono font-medium text-[2.2rem] leading-none mb-1 ${costColor}`}>
                        {results.costLost.toLocaleString('es-ES')}
                      </div>
                      <p className="text-[12px] font-inter text-white/45">coste clientes perdidos/mes</p>
                    </div>
                    <div className="text-center">
                      <PhoneCall size={18} className="mx-auto mb-2 text-[#2DD4BF]"/>
                      <div className="font-mono font-medium text-[#2DD4BF] text-[2.2rem] leading-none mb-1">
                        {results.missedCalls}
                      </div>
                      <p className="text-[12px] font-inter text-white/45">llamadas perdidas/mes</p>
                    </div>
                  </div>

                  {/* ROI box */}
                  <div className="rounded-xl border border-[#0F766E]/40 bg-[#0F766E]/08 p-5 mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={15} className="text-[#2DD4BF]"/>
                      <p className="text-[12px] font-mono text-[#2DD4BF] uppercase tracking-wider font-medium">RETORNO ESTIMADO</p>
                    </div>
                    <p className="text-[15px] font-inter text-white font-semibold">
                      Recuperas la inversion en{' '}
                      <span className="text-[#2DD4BF]">
                        {results.returnMonths === 1 ? 'menos de 1 mes' : `${results.returnMonths} meses`}
                      </span>
                    </p>
                  </div>

                  <div className="border-t border-white/[0.06] pt-5 text-center">
                    <p className="text-[14px] font-inter text-white/60 mb-4">
                      Quieres recuperar ese dinero? Te contactamos en 24h.
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
