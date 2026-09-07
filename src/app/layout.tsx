import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Barlow_Condensed } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
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

const SITE_URL = 'https://esentiaagency.es'
const SITE_DESCRIPTION =
  'Consultoría de IA para empresas en Barcelona. Analizamos tu negocio, encontramos por dónde se te escapan clientes y dinero, y automatizamos con IA para cerrar esa fuga. Sistemas a medida, no bots de plantilla.'

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
    'IA para PYMES',
    'atención al cliente automatizada',
    'chatbot WhatsApp',
    'asistente de voz IA',
    'consultoría IA Barcelona',
  ],
  authors: [{ name: 'Víctor Vallejo', url: SITE_URL }],
  creator: 'Esentia Agency',
  publisher: 'Esentia Agency',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: SITE_URL,
    siteName: 'Esentia Agency',
    title: 'La consultoría de IA que encuentra la fuga de tu negocio',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La consultoría de IA que encuentra la fuga de tu negocio',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: 'Esentia Agency',
  description: SITE_DESCRIPTION,
  url: SITE_URL,
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
    'Chatbots de WhatsApp',
    'Asistentes de voz con IA',
    'Automatización de atención al cliente',
  ],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Chatbots de WhatsApp con IA' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Asistentes de voz con IA' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automatizaciones de negocio con IA' } },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrains.variable} ${barlow.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-YXS7SWXMN7" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-YXS7SWXMN7');
      `}</Script>
      <body className="font-inter antialiased">
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          {children}
          <Analytics />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
