import React from 'react';
import type { Metadata } from 'next';
import '@/styles/index.css';
import { Providers } from './providers';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  metadataBase: new URL('https://descubra-januaria.com.br'),
  title: {
    default: 'Descubra Januária - Portal Oficial de Turismo',
    template: '%s | Descubra Januária'
  },
  description: 'Explore as riquezas turísticas de Januária. Conheça o majestoso Parque Nacional Cavernas do Peruaçu, delicie-se com a cachaça artesanal, gastronomia local e hospede-se com conforto.',
  keywords: ['Januária', 'Turismo', 'Cavernas do Peruaçu', 'Vale do Peruaçu', 'Norte de Minas', 'Rio São Francisco', 'Cachaça de Januária', 'Ecoturismo'],
  openGraph: {
    title: 'Descubra Januária - Portal de Turismo',
    description: 'Explore o Parque Nacional Cavernas do Peruaçu e as riquezas do Norte de Minas. Planeje sua viagem hoje mesmo!',
    url: 'https://descubra-januaria.com.br',
    siteName: 'Descubra Januária',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Descubra Januária',
    description: 'Explore o turismo em Januária e as Cavernas do Peruaçu.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
