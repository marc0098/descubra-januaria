import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cavernas do Peruaçu',
  description: 'Explore o Parque Nacional Cavernas do Peruaçu. Descubra sítios arqueológicos, pinturas rupestres e formações rochosas impressionantes em Januária.',
  openGraph: {
    title: 'Cavernas do Peruaçu | Descubra Januária',
    description: 'Explore o Parque Nacional Cavernas do Peruaçu e seus sítios arqueológicos incríveis.',
    url: 'https://descubra-januaria.com.br/cavernas',
  }
};

export default function CavernasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
