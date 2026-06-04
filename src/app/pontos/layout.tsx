import React from 'react';
import type { Metadata } from 'next';

const SITE_URL = 'https://descubrajanuaria.com.br';

export const metadata: Metadata = {
  title: 'Pontos Turísticos de Januária',
  description: 'Além das cavernas, descubra a rica história urbana de Januária. Conheça casarões centenários, o Rio São Francisco, a Igreja N. Sra. do Rosário (1688) e outras atrações históricas.',
  keywords: [
    'Pontos Turísticos Januária',
    'Igreja Rosário',
    'Rio São Francisco',
    'Centro Histórico Januária',
    'Casarões Coloniais',
    'Norte de Minas',
  ],
  alternates: {
    canonical: `${SITE_URL}/pontos`,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/pontos`,
    siteName: 'Descubra Januária',
    title: 'Pontos Turísticos de Januária',
    description: 'Descubra atrações urbanas, história, cultura e as belezas do Rio São Francisco.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Pontos Turísticos de Januária',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pontos Turísticos de Januária',
    description: 'Descubra atrações urbanas, história, cultura e as belezas do Rio São Francisco.',
    images: {
      url: '/opengraph-image',
      alt: 'Pontos Turísticos de Januária',
    },
  },
};

const pontosJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/pontos#list`,
  name: 'Pontos Turísticos de Januária',
  description: 'Lista de pontos turísticos de Januária - MG com história, cultura e natureza.',
  url: `${SITE_URL}/pontos`,
  numberOfItems: 6,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'TouristAttraction',
        name: 'Igreja N. Sra. do Rosário',
        description: 'Datada de 1688, é a segunda igreja mais antiga de Minas Gerais.',
        address: { '@type': 'PostalAddress', addressLocality: 'Januária', addressRegion: 'MG', addressCountry: 'BR' },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Place',
        name: 'Rio São Francisco',
        description: 'O rio da integração nacional, com belas paisagens e atividades de lazer.',
        address: { '@type': 'PostalAddress', addressLocality: 'Januária', addressRegion: 'MG', addressCountry: 'BR' },
      },
    },
  ],
};

export default function PontosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pontosJsonLd) }}
      />
      {children}
    </>
  );
}
