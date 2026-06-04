import React from 'react';
import type { Metadata } from 'next';

const SITE_URL = 'https://descubrajanuaria.com.br';

export const metadata: Metadata = {
  title: 'Guias de Turismo Credenciados em Januária',
  description: 'Agende seu passeio com guias de turismo credenciados pelo ICMBio. Profissionais capacitados para te levar com segurança ao Parque Nacional Cavernas do Peruaçu.',
  keywords: [
    'Guia de Turismo Januária',
    'Condutor ICMBio',
    'Cavernas do Peruaçu Guia',
    'Passeio Guiado Januária',
    'Turismo de Aventura MG',
  ],
  alternates: {
    canonical: `${SITE_URL}/guias`,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: `${SITE_URL}/guias`,
    siteName: 'Descubra Januária',
    title: 'Guias de Turismo em Januária',
    description: 'Encontre guias credenciados pelo ICMBio para visitar as Cavernas do Peruaçu com segurança e conhecimento.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Guias de Turismo em Januária',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guias de Turismo em Januária',
    description: 'Encontre guias credenciados pelo ICMBio para visitar as Cavernas do Peruaçu com segurança e conhecimento.',
    images: {
      url: '/opengraph-image',
      alt: 'Guias de Turismo em Januária',
    },
  },
};

const guiasJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/guias#list`,
  name: 'Guias de Turismo Credenciados em Januária',
  description: 'Lista de guias de turismo credenciados pelo ICMBio para visitação ao Parque Nacional Cavernas do Peruaçu.',
  url: `${SITE_URL}/guias`,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
};

export default function GuiasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guiasJsonLd) }}
      />
      {children}
    </>
  );
}
