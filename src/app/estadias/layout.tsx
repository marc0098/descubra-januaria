import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onde Ficar - Hotéis e Pousadas',
  description: 'Encontre as melhores opções de hospedagem em Januária. Hotéis confortáveis, pousadas aconchegantes e opções próximas ao Vale do Peruaçu.',
  openGraph: {
    title: 'Hotéis e Pousadas em Januária',
    description: 'Encontre as melhores opções de hospedagem para a sua viagem a Januária.',
    url: 'https://descubra-januaria.com.br/estadias',
  }
};

export default function EstadiasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
