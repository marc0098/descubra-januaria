import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #136862 0%, #DC6037 100%)',
          color: 'white',
          fontSize: 20,
          fontWeight: 900,
          fontFamily: 'system-ui',
          borderRadius: 6,
        }}
      >
        DJ
      </div>
    ),
    { ...size }
  );
}
