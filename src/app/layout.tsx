import React from 'react';
import type { Metadata } from 'next';
import '@/styles/index.css';
import { Providers } from './providers';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'Descubra Januária - Portal de Turismo Oficial',
  description: 'Explore as riquezas turísticas de Januária. Conheça o majestoso Parque Nacional Cavernas do Peruaçu, delicie-se com a cachaça artesanal e gastronomia local, agende guias credenciados e planeje sua hospedagem.',
  keywords: ['Januária', 'Turismo', 'Cavernas do Peruaçu', 'Vale do Peruaçu', 'Norte de Minas', 'Rio São Francisco', 'Ecoturismo', 'Viagem'],
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
