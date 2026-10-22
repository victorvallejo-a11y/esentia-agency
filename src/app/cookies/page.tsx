import Link from 'next/link'

export const metadata = {
  title: 'Política de Cookies | Esentia Agency',
}

export default function Cookies() {
  return (
    <main className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24">

        <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-inter text-[#64748B] hover:text-[#0F766E] transition-colors mb-12">
          ← Volver al inicio
        </Link>

        <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-inter font-semibold tracking-[-0.02em] text-[#1A1A1A] mb-3">
          Política de Cookies
        </h1>
        <p className="text-[13px] font-inter text-[#64748B] mb-12">Última actualización: octubre de 2026</p>

        <div className="prose prose-neutral max-w-none font-inter text-[15px] leading-relaxed text-[#374151] space-y-8">

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten al sitio recordar sus preferencias y mejorar su experiencia de navegación.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">Qué usamos exactamente</h2>

            <div className="space-y-5 mt-3">
              <div className="bg-white rounded-xl p-5 border border-black/[0.06]">
                <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-1">Necesaria · tu elección sobre cookies</h3>
                <p className="text-[14px] text-[#64748B]">
                  Guardamos en tu navegador (almacenamiento local, clave <code>es-consent</code>) si has aceptado o rechazado la analítica, para no volver a preguntarte en cada visita. Se queda en tu dispositivo hasta que la borres y no identifica a nadie.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-black/[0.06]">
                <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-1">Analítica · Google Analytics 4</h3>
                <p className="text-[14px] text-[#64748B]">
                  Solo si la aceptas. Instala las cookies <code>_ga</code> y <code>_ga_YXS7SWXMN7</code> (duración: 2 años) para contar visitas y saber qué secciones se usan, siempre de forma agregada. Sin publicidad ni perfiles. Mientras no aceptes, Google Analytics funciona en modo sin cookies (Consent Mode v2).
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-black/[0.06]">
                <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-1">Rendimiento · Vercel Web Analytics</h3>
                <p className="text-[14px] text-[#64748B]">
                  Mide visitas de forma anónima sin instalar cookies ni guardar nada en tu dispositivo.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">Cómo gestionar las cookies</h2>
            <p>Puede controlar y gestionar las cookies de las siguientes formas:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>
                <strong>En esta web:</strong> el enlace «Preferencias de cookies» del pie de página vuelve a abrir la ventana para cambiar tu elección cuando quieras.
              </li>
              <li>
                <strong>Configuración del navegador:</strong> La mayoría de navegadores permiten bloquear o eliminar cookies desde su configuración de privacidad.
              </li>
              <li>
                <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies
              </li>
              <li>
                <strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies
              </li>
              <li>
                <strong>Safari:</strong> Preferencias → Privacidad → Cookies
              </li>
            </ul>
            <p className="mt-3">
              Tenga en cuenta que deshabilitar ciertas cookies puede afectar al funcionamiento del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">Más información</h2>
            <p>
              Si tiene alguna duda sobre nuestra política de cookies, puede contactarnos en{' '}
              <a href="mailto:victor.vallejo@esentiaagency.es" className="text-[#0F766E] hover:underline">
                victor.vallejo@esentiaagency.es
              </a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
