import React from 'react';
import type { Metadata, Viewport } from 'next';
import '@/styles/index.css';
import { Providers } from './providers';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { Analytics } from '@vercel/analytics/react';

const SITE_URL = 'https://descubrajanuaria.com.br';
const SITE_NAME = 'Descubra Januária';
const SITE_DESCRIPTION = 'Explore as riquezas turísticas de Januária. Conheça o majestoso Parque Nacional Cavernas do Peruaçu, delicie-se com a cachaça artesanal, gastronomia local e hospede-se com conforto.';
const SITE_KEYWORDS = [
  'Januária',
  'Turismo',
  'Cavernas do Peruaçu',
  'Vale do Peruaçu',
  'Norte de Minas',
  'Rio São Francisco',
  'Cachaça de Januária',
  'Ecoturismo',
  'Minas Gerais',
  'Parque Nacional',
  'Patrimônio UNESCO',
  'Pinturas Rupestres',
  'Guia de Turismo',
  'Hospedagem Januária',
  'Gastronomia Mineira',
];

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3ECE2' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d0d' },
  ],
  colorScheme: 'light dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Descubra Januária - Portal Oficial de Turismo',
    template: '%s | Descubra Januária',
  },
  applicationName: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'travel',
  classification: 'Travel & Tourism',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'pt-BR': SITE_URL,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Descubra Januária - Portal Oficial de Turismo',
    description: 'Explore o Parque Nacional Cavernas do Peruaçu e as riquezas do Norte de Minas. Planeje sua viagem hoje mesmo!',
    countryName: 'Brasil',
    emails: ['contato@descubrajanuaria.com.br'],
    phoneNumbers: ['+55 38 9999-9999'],
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Descubra Januária - Portal Oficial de Turismo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@descubrajanuaria',
    creator: '@descubrajanuaria',
    title: 'Descubra Januária',
    description: 'Explore o turismo em Januária e as Cavernas do Peruaçu.',
    images: {
      url: '/twitter-image',
      alt: 'Descubra Januária - Portal Oficial de Turismo',
    },
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'default',
    startupImage: '/apple-icon',
  },
  appLinks: {
    web: {
      url: SITE_URL,
      should_fallback: true,
    },
  },
  other: {
    'geo.region': 'BR-MG',
    'geo.placename': 'Januária, Minas Gerais, Brasil',
    'geo.position': '-15.4887575;-44.3620074',
    'ICBM': '-15.4887575, -44.3620074',
    'distribution': 'global',
    'rating': 'general',
    'revisit-after': '7 days',
  },
  icons: {
    icon: [
      { url: '/icon', type: 'image/png', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: '/icon',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristInformationCenter',
  '@id': `${SITE_URL}#organization`,
  name: SITE_NAME,
  alternateName: 'Portal de Turismo de Januária',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/icon`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/opengraph-image`,
  description: SITE_DESCRIPTION,
  inLanguage: 'pt-BR',
  currenciesAccepted: 'BRL',
  paymentAccepted: 'Cash, Credit Card, Pix',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Januária',
    addressRegion: 'MG',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -15.4887575,
    longitude: -44.3620074,
  },
  areaServed: {
    '@type': 'City',
    name: 'Januária',
    sameAs: 'https://pt.wikipedia.org/wiki/Januária',
  },
  knowsAbout: [
    'Parque Nacional Cavernas do Peruaçu',
    'Ecoturismo',
    'Pinturas Rupestres',
    'Cachaça Artesanal',
    'Rio São Francisco',
    'Turismo Rural',
  ],
  touristType: [
    'Ecoturista',
    'Turista Cultural',
    'Aventureiro',
    'Família',
  ],
  sameAs: [
    SITE_URL,
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: 'pt-BR',
  publisher: { '@id': `${SITE_URL}#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/guias?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.januaria.mg.gov.br" />
        <meta name="theme-color" content="#136862" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Januária" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        <meta name="google-site-verification" content="" />
        <meta name="msvalidate.01" content="" />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
