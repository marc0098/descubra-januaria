import React from 'react';
import type { Metadata } from 'next';

const SITE_URL = 'https://descubrajanuaria.com.br';

export const metadata: Metadata = {
  title: 'Agenda de Eventos Culturais em Januária',
  description: 'Fique por dentro da agenda cultural de Januária. Festivais, shows, festas tradicionais, eventos religiosos e festas juninas imperdíveis no Norte de Minas.',
  keywords: [
    'Eventos Januária',
    'Agenda Cultural',
    'Festas Tradicionais',
    'Festa Junina Januária',
    'Turismo Cultural MG',
    'Eventos Norte de Minas',
  ],
  alternates: {
    canonical: `${SITE_URL}/eventos`,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/eventos`,
    siteName: 'Descubra Januária',
    title: 'Eventos em Januária | Agenda Cultural',
    description: 'Acompanhe os melhores eventos, festivais e festas de Januária.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Eventos Culturais em Januária',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventos em Januária | Agenda Cultural',
    description: 'Acompanhe os melhores eventos, festivais e festas de Januária.',
    images: {
      url: '/opengraph-image',
      alt: 'Eventos Culturais em Januária',
    },
  },
};

const eventosJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/eventos#list`,
  name: 'Agenda de Eventos Culturais em Januária',
  description: 'Lista de eventos culturais, festivais e festas tradicionais de Januária.',
  url: `${SITE_URL}/eventos`,
};

export default function EventosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventosJsonLd) }}
      />
      {children}
    </>
  );
}
