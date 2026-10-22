import type { Metadata, Viewport } from 'next'
import { Archivo, Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SmoothScrollProvider from '@/components/shared/SmoothScrollProvider'
import CookieConsent from '@/components/shared/CookieConsent'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  axes: ['wdth'],
})

// Interfaz de las maquetas (móviles, widgets): lo más parecido a la San Francisco de iOS.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
})

const SITE_URL = 'https://esentiaagency.es'
const GA_ID = 'G-YXS7SWXMN7'
const SITE_DESCRIPTION =
  'Consultoría de IA para empresas en Barcelona. Encontramos el cuello de botella de tu negocio (captación, pedidos, facturas, seguimiento o atención) y construimos el sistema a medida que lo quita. Diagnóstico gratis de 30 minutos.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Esentia · Consultoría de IA para empresas en Barcelona',
    template: '%s · Esentia Agency',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'consultoría de IA para empresas',
    'consultoría de inteligencia artificial',
    'servicios de IA para empresas',
    'automatización de procesos con IA',
    'automatización con IA',
    'IA para pymes',
    'IA para inmobiliarias',
    'automatizar pedidos WhatsApp',
    'chatbot WhatsApp',
    'asistente de voz IA',
    'consultoría IA Barcelona',
  ],
  authors: [{ name: 'Víctor Vallejo', url: SITE_URL }],
  creator: 'Esentia Agency',
  publisher: 'Esentia Agency',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: SITE_URL,
    siteName: 'Esentia Agency',
    title: 'Tu negocio no duerme. Tus procesos tampoco.',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tu negocio no duerme. Tus procesos tampoco.',
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      // Logo 180×180 declarado también como favicon: Google exige ≥48px,
      // y el de 32px por sí solo hace que muestre el globo genérico.
      { url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: '#F6F4EE',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: 'Esentia Agency',
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  email: 'victor.vallejo@esentiaagency.es',
  telephone: '+34711237051',
  founder: { '@type': 'Person', name: 'Víctor Vallejo' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Barcelona',
    addressRegion: 'Barcelona',
    addressCountry: 'ES',
  },
  areaServed: { '@type': 'Country', name: 'España' },
  knowsAbout: [
    'Inteligencia artificial para empresas',
    'Automatización de procesos',
    'Captación de propietarios para inmobiliarias',
    'Automatización de pedidos por WhatsApp',
    'Lectura automática de facturas',
    'Asistentes de voz con IA',
  ],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Diagnóstico gratuito de procesos' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sistemas de IA a medida para pymes' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Asistentes de WhatsApp y de voz con IA' } },
  ],
}

// Consent Mode v2: todo denegado hasta que la persona acepte en el aviso.
const consentBoot = `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('es-consent')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}
gtag('js',new Date());gtag('config','${GA_ID}');
document.documentElement.classList.add('js');
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: consentBoot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <SmoothScrollProvider>
          {children}
          <CookieConsent />
          <Analytics />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
