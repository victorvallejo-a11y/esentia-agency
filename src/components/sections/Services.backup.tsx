'use client'
import { useState, useRef } from 'react'
import RevealOnScroll from '@/components/shared/RevealOnScroll'
import { MessageSquare, Phone, Zap, Bot, Users, BarChart3, X } from 'lucide-react'

const services = [
  {
    icon: MessageSquare,
    title: 'Chatbot de WhatsApp y web',
    desc: 'Tu negocio responde, informa y agenda citas en tiempo real, las 24 horas.',
    detail: 'Reduce hasta un 80% las preguntas repetitivas. El bot atiende en segundos, califica al cliente y agenda citas directamente en tu calendario. Funciona en WhatsApp, web e Instagram.',
    metric: 'Hasta 80% menos consultas manuales',
  },
  {
    icon: Phone,
    title: 'Recepcionista de voz inteligente',
    desc: 'Coge el telefono, gestiona reservas y responde preguntas frecuentes.',
    detail: 'Nunca mas una llamada perdida. El asistente de voz atiende 24/7, gestiona tu agenda, confirma citas y transfiere al humano solo cuando es necesario.',
    metric: '-65% tiempo en llamadas repetitivas',
  },
  {
    icon: Zap,
    title: 'Automatizacion de procesos',
    desc: 'Conectamos tus herramientas y eliminamos el trabajo repetitivo.',
    detail: 'Integramos tu CRM, facturacion, email y WhatsApp en un flujo automatico. Lo que antes tomaba horas, ahora ocurre solo.',
    metric: 'Hasta 12h/semana recuperadas por empleado',
  },
  {
    icon: Bot,
    title: 'Agentes de IA a medida',
    desc: 'Construimos agentes de IA que se integran con tus sistemas.',
    detail: 'Agentes que leen tu base de datos, consultan stock, generan presupuestos y actualizan registros — sin intervension humana en tareas rutinarias.',
    metric: '3x mas velocidad en procesos internos',
  },
  {
    icon: Users,
    title: 'Captacion y cualificacion de leads',
    desc: 'Identifica a los clientes con mas potencial automaticamente.',
    detail: 'El sistema evalua cada lead en tiempo real, le asigna una puntuacion y notifica a tu equipo solo con los mas cualificados. Menos tiempo perdido, mas ventas cerradas.',
    metric: '2.4x mas leads cualificados por mes',
  },
  {
    icon: BarChart3,
    title: 'Informes y analitica automatica',
    desc: 'Recibe cada semana un resumen de lo que pasa en tu negocio.',
    detail: 'Dashboard automatico con KPIs de atencion al cliente, ventas y operaciones. Cada lunes en tu bandeja de entrada, sin tocar una hoja de calculo.',
    metric: '100% datos sin trabajo manual',
  },
]

export default function Services() {
  return (
    <section id="servicios" className="bg-[#FAFAF7] py-28">
      <div className="max-w-6xl mx-auto px-6">
        <RevealOnScroll className="mb-14">
          <p className="text-[12px] font-inter uppercase tracking-[0.15em] text-[#0F766E] mb-4">Servicios</p>
          <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-inter font-semibold leading-tight tracking-[-0.02em]">
            Seis formas de <span className="text-[#0F766E]">hacer mas</span> sin contratar mas
          </h2>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, i) => (
            <ServiceCard key={i} {...svc} index={i}/>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ icon: Icon, title, desc, detail, metric, index }: {
  icon: React.ElementType; title: string; desc: string; detail: string; metric: string; index: number
}) {
  const [open, setOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (open) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-5px) scale(1.01)`
  }
  const handleMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0) scale(1)'
    el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'
  }
  const handleMouseEnter = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transition = 'transform 0.12s ease'
  }

  return (
    <RevealOnScroll delay={index * 70} direction="scale">
      <div
        ref={cardRef}
        className="relative bg-[#111111] rounded-xl overflow-hidden h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{ transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: '0 0 0 1px rgba(15,118,110,0.15)' }}
      >
        {/* Card content */}
        <div className="p-7 flex flex-col gap-5 h-full">
          <div className="w-10 h-10 rounded-lg bg-[#0F766E]/10 flex items-center justify-center flex-shrink-0">
            <Icon size={17} className="text-[#2DD4BF]"/>
          </div>
          <div className="flex-1">
            <h3 className="text-[15px] font-inter font-semibold text-white leading-snug mb-2">{title}</h3>
            <p className="text-[13px] font-inter text-white/50 leading-relaxed">{desc}</p>
          </div>
          <div className="mt-auto pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => setOpen(true)}
              className="text-[12px] font-inter text-[#0F766E] hover:text-[#2DD4BF] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Saber mas +
            </button>
          </div>
        </div>

        {/* Inline modal overlay */}
        {open && (
          <div
            className="absolute inset-0 bg-[#0d0d0d] rounded-xl p-7 flex flex-col gap-4 z-20"
            style={{ animation: 'modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[15px] font-inter font-semibold text-white leading-snug">{title}</h3>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors flex-shrink-0 mt-0.5" aria-label="Cerrar">
                <X size={16}/>
              </button>
            </div>
            <p className="text-[13px] font-inter text-white/65 leading-relaxed flex-1">{detail}</p>
            <div className="mt-auto px-4 py-3 rounded-lg bg-[#0F766E]/10 border border-[#0F766E]/20">
              <p className="text-[13px] font-mono font-medium text-[#2DD4BF]">{metric}</p>
            </div>
          </div>
        )}
      </div>
    </RevealOnScroll>
  )
}
