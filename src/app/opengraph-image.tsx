import { ImageResponse } from 'next/og'

export const alt = 'Esentia · Servicios de IA para empresas que trabajan 24/7'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Imagen que se muestra al compartir la web (WhatsApp, LinkedIn, X, Google).
// Se genera en build/servidor, sin fuentes ni assets externos.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FAFAF7',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '8px',
              backgroundColor: '#0F766E',
            }}
          />
          <div style={{ fontSize: '34px', fontWeight: 600, color: '#1A1A1A', letterSpacing: '-0.02em' }}>
            Esentia Agency
          </div>
        </div>

        {/* Titular */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '76px',
              fontWeight: 700,
              color: '#1A1A1A',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Servicios de IA para</span>
            <span>
              empresas que <span style={{ color: '#0F766E' }}>no duermen</span>
            </span>
          </div>
          <div style={{ marginTop: '28px', fontSize: '30px', color: '#475569', display: 'flex' }}>
            Chatbots de WhatsApp · Asistentes de voz · Automatización 24/7
          </div>
        </div>

        {/* Pie */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '26px', color: '#0F766E', fontWeight: 500 }}>esentiaagency.es</div>
          <div style={{ fontSize: '24px', color: '#64748B' }}>Barcelona · España</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
