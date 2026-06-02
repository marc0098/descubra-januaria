import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Temporada de Praia',
  description: '100 Dias de Verão em Januária! Aproveite as praias do Rio São Francisco com barracas, shows ao vivo, segurança e muita diversão.',
  openGraph: {
    title: 'Temporada de Praia - 100 Dias em Januária',
    description: '100 Dias de Verão em Januária! Aproveite as praias do Rio São Francisco com barracas, shows ao vivo e segurança.',
    url: 'https://descubra-januaria.com.br/praia',
    siteName: 'Descubra Januária',
    images: [
      {
        url: 'https://descubra-januaria.com.br/assets/graphics/praia-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Temporada de Praia em Januária',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  }
};

export default function PraiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
