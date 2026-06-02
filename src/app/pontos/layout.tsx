import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pontos Turísticos',
  description: 'Além das cavernas, descubra a rica história urbana de Januária. Conheça casarões centenários, o Rio São Francisco e atrações da nossa cidade.',
  openGraph: {
    title: 'Pontos Turísticos de Januária',
    description: 'Descubra atrações urbanas, história, cultura e as belezas do Rio São Francisco.',
    url: 'https://descubra-januaria.com.br/pontos',
  }
};

export default function PontosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
