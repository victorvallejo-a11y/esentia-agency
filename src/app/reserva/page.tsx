import type { Metadata, Viewport } from 'next'
import './reserva.css'
import ReservaClient from './ReservaClient'

// Página de reserva del enlace de Instagram: pensada para el navegador interno de Instagram (móvil, con barras arriba y abajo).
export const metadata: Metadata = {
  title: 'Reserva tu llamada',
  description: 'Elige día y hora para tu diagnóstico gratis de 30 minutos con Víctor Vallejo.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#F6F4EE',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function ReservaPage() {
  return <ReservaClient />
}
