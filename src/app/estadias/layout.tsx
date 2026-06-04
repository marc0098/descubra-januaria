import React from 'react';
import type { Metadata } from 'next';

const SITE_URL = 'https://descubrajanuaria.com.br';

export const metadata: Metadata = {
  title: 'Hospedagem em Januária - Hotéis, Pousadas e Chalés',
  description: 'Encontre as melhores opções de hospedagem em Januária. Hotéis confortáveis no centro, pousadas aconchegantes e chalés próximos ao Vale do Peruaçu.',
  keywords: [
    'Hospedagem Januária',
    'Hotel Januária',
    'Pousada Januária',
    'Onde ficar Januária',
    'Chalé Peruaçu',
    'Hospedagem Norte de Minas',
  ],
  alternates: {
    canonical: `${SITE_URL}/estadias`,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/estadias`,
    siteName: 'Descubra Januária',
    title: 'Hotéis e Pousadas em Januária',
    description: 'Encontre as melhores opções de hospedagem para a sua viagem a Januária.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Hospedagem em Januária',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotéis e Pousadas em Januária',
    description: 'Encontre as melhores opções de hospedagem para a sua viagem a Januária.',
    images: {
      url: '/opengraph-image',
      alt: 'Hospedagem em Januária',
    },
  },
};

const estadiasJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/estadias#list`,
  name: 'Hospedagem em Januária',
  description: 'Lista de hotéis, pousadas e chalés em Januária e arredores do Vale do Peruaçu.',
  url: `${SITE_URL}/estadias`,
};

export default function EstadiasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(estadiasJsonLd) }}
      />
      {children}
    </>
  );
}
