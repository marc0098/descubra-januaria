import React from 'react';
import type { Metadata } from 'next';

const SITE_URL = 'https://descubrajanuaria.com.br';

export const metadata: Metadata = {
  title: 'Cavernas do Peruaçu - Parque Nacional UNESCO',
  description: 'Explore o Parque Nacional Cavernas do Peruaçu. Mais de 140 grutas catalogadas, pinturas rupestres de 12 mil anos, a maior estalactite do mundo e Patrimônio Mundial da UNESCO desde 2025.',
  keywords: [
    'Cavernas do Peruaçu',
    'Parque Nacional',
    'UNESCO',
    'Pinturas Rupestres',
    'Lapa Bonita',
    'Januária',
    'Turismo de Aventura',
    'Ecoturismo',
  ],
  alternates: {
    canonical: `${SITE_URL}/cavernas`,
  },
  openGraph: {
    type: 'article',
    locale: 'pt_BR',
    url: `${SITE_URL}/cavernas`,
    siteName: 'Descubra Januária',
    title: 'Cavernas do Peruaçu | Descubra Januária',
    description: 'Explore o Parque Nacional Cavernas do Peruaçu e seus sítios arqueológicos incríveis.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Cavernas do Peruaçu - Januária MG',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cavernas do Peruaçu | Descubra Januária',
    description: 'Explore o Parque Nacional Cavernas do Peruaçu e seus sítios arqueológicos incríveis.',
    images: {
      url: '/opengraph-image',
      alt: 'Cavernas do Peruaçu',
    },
  },
};

const cavernasJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  '@id': `${SITE_URL}/cavernas#attraction`,
  name: 'Parque Nacional Cavernas do Peruaçu',
  alternateName: 'Cavernas do Peruaçu',
  description: 'Parque Nacional com mais de 140 cavernas catalogadas, pinturas rupestres de até 12.000 anos e a maior estalactite do mundo. Patrimônio Mundial da UNESCO desde 2025.',
  url: `${SITE_URL}/cavernas`,
  image: `${SITE_URL}/opengraph-image`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Januária',
    addressRegion: 'MG',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -15.1214,
    longitude: -44.2478,
  },
  isAccessibleForFree: false,
  publicAccess: true,
  touristType: ['Ecoturista', 'Aventureiro', 'Turista Cultural', 'Família'],
  availableLanguage: ['Portuguese'],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00',
    closes: '18:00',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1280',
    bestRating: '5',
    worstRating: '1',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Trilhas Guiadas', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Pinturas Rupestres', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Estalactites', value: true },
  ],
};

export default function CavernasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cavernasJsonLd) }}
      />
      {children}
    </>
  );
}
