import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Temporada de Praia — Januária',
  description: '100 Dias de Verão em Januária. Praias do Rio São Francisco, barracas, shows ao vivo, segurança e muito mais. Verão que não acaba.',
  openGraph: {
    title: '100 Dias de Verão — Temporada de Praia em Januária',
    description: 'As praias do Rio São Francisco te esperam. Shows, estrutura completa e natureza incrível por 100 dias.',
    url: 'https://descubra-januaria.com.br/praia',
    siteName: 'Descubra Januária',
    images: [
      {
        url: 'https://descubra-januaria.com.br/assets/graphics/praia-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Temporada de Praia em Januária — Rio São Francisco',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '100 Dias de Verão — Januária',
    description: 'As praias do Rio São Francisco te esperam.',
  },
};

export default function PraiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}