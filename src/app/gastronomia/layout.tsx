import React from 'react';
import type { Metadata } from 'next';

const SITE_URL = 'https://descubrajanuaria.com.br';

export const metadata: Metadata = {
  title: 'Gastronomia de Januária - Restaurantes e Cachaças Artesanais',
  description: 'Sabores únicos do Norte de Minas. Conheça os melhores restaurantes de Januária, pratos típicos com peixes do rio, arroz com pequi e descubra a famosa cachaça artesanal da região.',
  keywords: [
    'Gastronomia Januária',
    'Cachaça Artesanal Januária',
    'Culinária Mineira',
    'Restaurantes Januária',
    'Pequi',
    'Arroz com Pequi',
    'Comida Típica Norte de Minas',
  ],
  alternates: {
    canonical: `${SITE_URL}/gastronomia`,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/gastronomia`,
    siteName: 'Descubra Januária',
    title: 'Gastronomia de Januária',
    description: 'Restaurantes, culinária típica e as famosas cachaças artesanais de Januária.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Gastronomia de Januária',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gastronomia de Januária',
    description: 'Restaurantes, culinária típica e as famosas cachaças artesanais de Januária.',
    images: {
      url: '/opengraph-image',
      alt: 'Gastronomia de Januária',
    },
  },
};

const gastronomiaJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/gastronomia#list`,
  name: 'Gastronomia de Januária',
  description: 'Lista de restaurantes, pratos típicos e cachaças artesanais de Januária.',
  url: `${SITE_URL}/gastronomia`,
};

export default function GastronomiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gastronomiaJsonLd) }}
      />
      {children}
    </>
  );
}
