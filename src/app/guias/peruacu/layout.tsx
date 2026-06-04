import React from 'react';
import type { Metadata } from 'next';

const SITE_URL = 'https://descubrajanuaria.com.br';

export const metadata: Metadata = {
  title: 'Roteiro Peruaçu - 2 Dias de Aventura no Vale',
  description: 'Roteiro completo de 2 dias pelo Parque Nacional Cavernas do Peruaçu. Trilhas, cavernas, cachoeiras, pinturas rupestres e hospedagem em hotel fazenda. Inclui o que levar e programação detalhada.',
  keywords: [
    'Roteiro Peruaçu',
    'Cavernas Peruaçu 2 dias',
    'Lapa Bonita',
    'Cachoeira do Buracão',
    'Mirante do Vale',
    'Lapa dos Índios',
    'Pinturas Rupestres',
  ],
  alternates: {
    canonical: `${SITE_URL}/guias/peruacu`,
  },
  openGraph: {
    type: 'article',
    locale: 'pt_BR',
    url: `${SITE_URL}/guias/peruacu`,
    siteName: 'Descubra Januária',
    title: 'Roteiro Peruaçu - Aventura de 2 Dias | Descubra Januária',
    description: 'Descubra a magia do Vale do Peruaçu em uma experiência inesquecível de 2 dias. Trilhas, cavernas, cachoeiras e história.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Roteiro Peruaçu - Vale do Peruaçu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roteiro Peruaçu - 2 Dias de Aventura',
    description: 'Roteiro completo pelo Vale do Peruaçu com trilhas, cavernas e cachoeiras.',
    images: {
      url: '/opengraph-image',
      alt: 'Roteiro Peruaçu',
    },
  },
};

const roteiroJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  '@id': `${SITE_URL}/guias/peruacu#trip`,
  name: 'Roteiro Peruaçu - 2 Dias',
  description: 'Roteiro turístico de 2 dias pelo Parque Nacional Cavernas do Peruaçu, com visita a cavernas, cachoeiras, trilhas e sítios arqueológicos com pinturas rupestres.',
  url: `${SITE_URL}/guias/peruacu`,
  touristType: ['Aventureiro', 'Ecoturista', 'Turista Cultural'],
  itinerary: {
    '@type': 'ItemList',
    numberOfItems: 2,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'TouristAttraction',
          name: 'Dia 1 - A Magia das Cavernas',
          description: 'Saída de Januária, visita às cavernas com formações rochosas únicas, almoço típico e Cachoeira do Buracão. Pernoite em hotel fazenda.',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'TouristAttraction',
          name: 'Dia 2 - Trilhas e História',
          description: 'Mirante do Vale, Lapa dos Índios com pinturas rupestres, almoço às margens do Rio Peruaçu e retorno.',
        },
      },
    ],
  },
};

export default function GuiaPeruacuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roteiroJsonLd) }}
      />
      {children}
    </>
  );
}
