import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad | Esentia Agency',
}

export default function Privacidad() {
  return (
    <main className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24">

        <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-inter text-[#64748B] hover:text-[#0F766E] transition-colors mb-12">
          ← Volver al inicio
        </Link>

        <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-inter font-semibold tracking-[-0.02em] text-[#1A1A1A] mb-3">
          Política de Privacidad
        </h1>
        <p className="text-[13px] font-inter text-[#64748B] mb-12">Última actualización: noviembre de 2026</p>

        <div className="prose prose-neutral max-w-none font-inter text-[15px] leading-relaxed text-[#374151] space-y-8">

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">1. Responsable del tratamiento</h2>
            <p>
              El responsable del tratamiento de sus datos personales es <strong>Esentia Agency</strong>, con dirección de contacto en{' '}
              <a href="mailto:victor.vallejo@esentiaagency.es" className="text-[#0F766E] hover:underline">
                victor.vallejo@esentiaagency.es
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">2. Datos que recopilamos</h2>
            <p>Podemos recopilar los siguientes datos personales:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Información sobre su empresa o negocio</li>
              <li>Usuario de Instagram, país y zona horaria (si reserva una sesión)</li>
              <li>Datos de navegación (mediante cookies técnicas)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">3. Finalidad del tratamiento</h2>
            <p>Sus datos personales se utilizan para:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>Gestionar solicitudes de información y contacto</li>
              <li>Agendar y gestionar reuniones de consultoría</li>
              <li>Enviar comunicaciones comerciales relacionadas con nuestros servicios (solo con su consentimiento)</li>
              <li>Cumplir con obligaciones legales y contractuales</li>
            </ul>
          </section>

          <section id="reservas" className="scroll-mt-24">
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">4. Reserva de una sesión de diagnóstico</h2>
            <p>Al reservar una sesión (desde esta web o desde el enlace que le enviamos por Instagram) le pedimos:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>Nombre, email, teléfono con prefijo, país y zona horaria</li>
              <li>Su usuario de Instagram y la web de su empresa (opcionales)</li>
              <li>
                Datos de su negocio: a qué se dedica, cuántas personas trabajan en él, ticket medio, clientes nuevos al mes, qué quiere conseguir con la llamada, para cuándo querría una solución y quién más participa en la decisión
              </li>
            </ul>
            <p className="mt-3">
              Los usamos para reservar su hueco, enviarle la invitación y el enlace de la videollamada, preparar la sesión, recordarle la cita y gestionar cambios o cancelaciones. Si llega desde Instagram, el enlace que le enviamos incluye un identificador de su conversación, que usamos para relacionar la reserva con su mensaje y confirmársela por ahí.
            </p>
            <p className="mt-3">
              Estos datos se guardan en Google (Calendar y Meet), que nos presta el servicio de calendario y videollamada, y en las herramientas de automatización de Esentia Agency. No los vendemos.
            </p>
            <p className="mt-3">
              La agenda es limitada: al reservar acepta un compromiso de asistencia. Si no se presenta sin avisar, lo anotamos para no volver a ofrecerle hueco. Puede pedirnos en cualquier momento que borremos sus datos de la reserva escribiendo a{' '}
              <a href="mailto:victor.vallejo@esentiaagency.es" className="text-[#0F766E] hover:underline">
                victor.vallejo@esentiaagency.es
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">5. Base legal</h2>
            <p>
              El tratamiento de sus datos se basa en su consentimiento expreso, en la ejecución de un contrato o en el interés legítimo de Esentia Agency para gestionar las relaciones comerciales con sus clientes y potenciales clientes.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">6. Conservación de datos</h2>
            <p>
              Sus datos se conservarán durante el tiempo necesario para cumplir la finalidad para la que fueron recabados y, en todo caso, durante los plazos legalmente establecidos. Una vez finalizada la relación, los datos serán bloqueados y posteriormente eliminados.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">7. Sus derechos</h2>
            <p>Usted tiene derecho a:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li><strong>Acceso:</strong> conocer qué datos tratamos sobre usted</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos</li>
              <li><strong>Supresión:</strong> solicitar la eliminación de sus datos</li>
              <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos</li>
              <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado</li>
              <li><strong>Limitación:</strong> solicitar la restricción del tratamiento</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, puede contactarnos en{' '}
              <a href="mailto:victor.vallejo@esentiaagency.es" className="text-[#0F766E] hover:underline">
                victor.vallejo@esentiaagency.es
              </a>.
              También tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">8. Seguridad</h2>
            <p>
              Esentia Agency ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad e integridad de los datos personales, así como para evitar su pérdida, alteración o acceso no autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] mb-3">9. Cambios en esta política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política de privacidad cuando sea necesario. Le notificaremos cualquier cambio significativo a través de los canales habituales de comunicación.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
