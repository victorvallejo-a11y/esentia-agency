import { ImageResponse } from 'next/og'

export const alt = 'Esentia Agency · Tu negocio no duerme. Tus procesos tampoco.'
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
          backgroundColor: '#F6F4EE',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Marca */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '34px', fontWeight: 700, color: '#14201E', letterSpacing: '0.08em' }}>ESENTIA</div>
          <div style={{ fontSize: '17px', fontWeight: 500, color: '#5C6966', letterSpacing: '0.24em', marginTop: '4px' }}>AGENCY</div>
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
            <span>Tu negocio no duerme.</span>
            <span>
              Tus procesos <span style={{ color: '#0F766E' }}>tampoco.</span>
            </span>
          </div>
          <div style={{ marginTop: '28px', fontSize: '30px', color: '#475569', display: 'flex' }}>
            Consultoría de IA · Encontramos el cuello de botella de tu negocio
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
