import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import SmoothScrollProvider from '@/components/shared/SmoothScrollProvider'
import CustomCursor from '@/components/shared/CustomCursor'
import Navbar from '@/components/shared/Navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
})

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://esentia.agency'),
  title: 'Esentia Agency — Automatización con IA para PYMEs',
  description: 'Chatbots de WhatsApp, asistentes de voz y automatizaciones con IA que trabajan 24/7 para tu negocio.',
  keywords: ['automatización IA', 'chatbot WhatsApp', 'asistente voz', 'PYME', 'agencia IA', 'Barcelona'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrains.variable} ${barlow.variable}`}>
      <head />
      <body className="font-inter antialiased">
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
