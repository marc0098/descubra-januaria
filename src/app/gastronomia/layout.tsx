import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gastronomia e Cachaças',
  description: 'Sabores únicos do Norte de Minas. Conheça os melhores restaurantes de Januária e descubra por que nossa cachaça artesanal é famosa no mundo todo.',
  openGraph: {
    title: 'Gastronomia de Januária',
    description: 'Restaurantes, culinária típica e as famosas cachaças artesanais de Januária.',
    url: 'https://descubra-januaria.com.br/gastronomia',
  }
};

export default function GastronomiaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
