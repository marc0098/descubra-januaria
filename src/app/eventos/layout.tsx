import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agenda de Eventos',
  description: 'Fique por dentro da agenda cultural de Januária. Festivais, shows, festas tradicionais e eventos imperdíveis no Norte de Minas.',
  openGraph: {
    title: 'Eventos em Januária | Agenda Cultural',
    description: 'Acompanhe os melhores eventos, festivais e festas de Januária.',
    url: 'https://descubra-januaria.com.br/eventos',
  }
};

export default function EventosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
