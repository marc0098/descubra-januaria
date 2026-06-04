import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Descubra Januária - Portal Oficial de Turismo';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b2924 0%, #136862 55%, #DC6037 100%)',
          color: 'white',
          fontFamily: 'system-ui',
          padding: 60,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
            padding: '10px 24px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          Norte de Minas Gerais
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.1,
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Descubra Januária
        </div>
        <div
          style={{
            fontSize: 36,
            opacity: 0.95,
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          Portal Oficial de Turismo
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.8,
            maxWidth: 900,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Parque Nacional Cavernas do Peruaçu • Cachaça Artesanal • Rio São Francisco
        </div>
      </div>
    ),
    { ...size }
  );
}
