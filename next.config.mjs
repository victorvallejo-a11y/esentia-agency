import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // La raíz es esta carpeta: hay otro package-lock.json en C:\Users\victo y Next
  // tomaba la carpeta de usuario entera como proyecto (y se quedaba sin memoria).
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Oculta el header "X-Powered-By: Next.js" — no des pistas al atacante
  poweredByHeader: false,

  // /prueba = regalo REFORMA de Instagram (página estática en public/prueba.html, la genera
  // demos-video-n8n/_gen_prueba_reforma.cjs). Va aquí y no en n8n porque n8n sirve sus páginas
  // con CSP sandbox y el navegador bloquea el micro.
  async rewrites() {
    return [{ source: '/prueba', destination: '/prueba.html' }]
  },

  // ── Security Headers ─────────────────────────────────────────────────────
  async headers() {
    // En desarrollo, Next necesita 'unsafe-eval' para el hot-reload (HMR/React Refresh).
    // En producción NO se permite: la CSP sigue igual de estricta.
    const isDev = process['env']['NODE_ENV'] !== 'production'
    return [
      {
        source: '/(.*)',
        headers: [
          // Evita clickjacking — nadie puede cargar esta web en un iframe
          { key: 'X-Frame-Options', value: 'DENY' },

          // El navegador no adivina el tipo MIME del contenido
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // Solo envía referrer al mismo origen o HTTPS externos
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // Fuerza HTTPS durante 2 años (HSTS)
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },

          // Deshabilita acceso a hardware sensible
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },

          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://va.vercel-scripts.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // Página de prueba: micro permitido y solo puede hablar con el webhook de n8n
      ...['/prueba', '/prueba.html'].map((source) => ({
        source,
        headers: [
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), payment=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "media-src 'self' blob:",
              "connect-src 'self' https://devn8n.esentiaagency.es",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      })),
    ]
  },
}

export default nextConfig
