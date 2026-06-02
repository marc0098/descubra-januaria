import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guias Credenciados',
  description: 'Agende seu passeio com guias de turismo credenciados. Profissionais capacitados para te levar com segurança ao Parque Nacional Cavernas do Peruaçu.',
  openGraph: {
    title: 'Guias de Turismo em Januária',
    description: 'Encontre guias credenciados para visitar as Cavernas do Peruaçu com segurança e conhecimento.',
    url: 'https://descubra-januaria.com.br/guias',
  }
};

export default function GuiasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
