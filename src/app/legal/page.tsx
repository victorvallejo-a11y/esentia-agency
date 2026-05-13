import Link from 'next/link'

export const metadata = {
  title: 'Aviso Legal | Esentia Agency',
}

export default function Legal() {
  return (
    <main className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24">

        <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-inter text-[#64748B] hover:text-[#0F766E] transition-colors mb-12">
          ← Volver al inicio
        </Link>

        <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-inter font-semibold tracking-[-0.02em] text-[#1A1A1A] mb-3">
          Aviso Legal
        </h1>
        <p className="text-[13px] font-inter text-[#64748B] mb-12">Última actualización: mayo de 2026</p>

        <div className="prose prose-neutral max-w-none font-inter text-[15px] leading-relaxed text-[#374151] space-y-8">

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">1. Datos identificativos</h2>
            <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se informa:</p>
            <ul className="list-none mt-3 space-y-1">
              <li><strong>Denominación:</strong> Esentia Agency</li>
              <li><strong>Actividad:</strong> Consultoría de automatización e inteligencia artificial para empresas</li>
              <li><strong>Email:</strong>{' '}
                <a href="mailto:victor.vallejo@esentiaagency.es" className="text-[#0F766E] hover:underline">
                  victor.vallejo@esentiaagency.es
                </a>
              </li>
              <li><strong>Teléfono:</strong> +34 711 237 051</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">2. Objeto y ámbito de aplicación</h2>
            <p>
              El presente Aviso Legal regula el acceso y uso del sitio web de Esentia Agency. El acceso y uso de este sitio web implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este aviso legal.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">3. Propiedad intelectual e industrial</h2>
            <p>
              Todos los contenidos del sitio web —incluyendo textos, fotografías, gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente— son propiedad intelectual de Esentia Agency o de terceros que han autorizado su uso, y están protegidos por las leyes españolas e internacionales de propiedad intelectual e industrial.
            </p>
            <p className="mt-3">
              Queda expresamente prohibida la reproducción, distribución, comunicación pública o transformación de dichos contenidos sin autorización expresa y por escrito de Esentia Agency.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">4. Exclusión de responsabilidad</h2>
            <p>
              Esentia Agency no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran ocasionarse a causa de:
            </p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>La falta de disponibilidad o accesibilidad al sitio web</li>
              <li>La interrupción del funcionamiento del sitio por causas ajenas a Esentia Agency</li>
              <li>El uso que los usuarios hagan del sitio web y sus contenidos</li>
              <li>La presencia de virus o elementos lesivos en los contenidos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">5. Hiperenlaces</h2>
            <p>
              El sitio web puede contener enlaces a páginas de terceros. Esentia Agency no controla el contenido de dichos sitios y no asume responsabilidad alguna por los daños que pudiera causar el acceso a los mismos.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">6. Legislación aplicable y jurisdicción</h2>
            <p>
              Las relaciones entre Esentia Agency y los usuarios del sitio web se rigen por la legislación española vigente. Para la resolución de cualquier controversia, las partes se someten a los Juzgados y Tribunales del domicilio del usuario, salvo que la ley disponga otra cosa.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">7. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con este aviso legal, puede contactarnos en{' '}
              <a href="mailto:victor.vallejo@esentiaagency.es" className="text-[#0F766E] hover:underline">
                victor.vallejo@esentiaagency.es
              </a>{' '}
              o llamando al <a href="tel:+34711237051" className="text-[#0F766E] hover:underline">+34 711 237 051</a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
