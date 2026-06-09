/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Oculta el header "X-Powered-By: Next.js" — no des pistas al atacante
  poweredByHeader: false,

  // ── Security Headers ─────────────────────────────────────────────────────
  async headers() {
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
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://formspree.io https://www.google-analytics.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://formspree.io",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
