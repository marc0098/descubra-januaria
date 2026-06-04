import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Descubra Januária - Portal de Turismo',
    short_name: 'Januária',
    description: 'Portal oficial de turismo de Januária - MG. Cavernas do Peruaçu, cachaça artesanal, gastronomia e hospedagem no Norte de Minas.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F3ECE2',
    theme_color: '#136862',
    lang: 'pt-BR',
    scope: '/',
    categories: ['travel', 'lifestyle', 'food', 'nature'],
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
