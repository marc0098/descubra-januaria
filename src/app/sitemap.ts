export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const SITE_URL = 'https://descubrajanuaria.com.br';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface RouteEntry {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  lastModified?: Date;
}

const staticRoutes: RouteEntry[] = [
  { path: '', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/cavernas', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/pontos', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/gastronomia', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/estadias', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/eventos', changeFrequency: 'daily', priority: 0.9 },
  { path: '/guias', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/guias/peruacu', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/sobre', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/privacidade', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/termos', changeFrequency: 'yearly', priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: route.lastModified || now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const [pontosSnap, hoteisSnap, eventosSnap, gastronomiaSnap, guiasSnap, atrativosSnap] = await Promise.all([
      getDocs(collection(db, 'pontos')),
      getDocs(collection(db, 'hoteis')),
      getDocs(collection(db, 'eventos')),
      getDocs(collection(db, 'gastronomia')),
      getDocs(collection(db, 'guias')),
      getDocs(collection(db, 'atrativos')),
    ]);

    const buildEntries = (
      snap: Awaited<ReturnType<typeof getDocs>>,
      segment: string,
      priority: number,
      cf: ChangeFrequency
    ): MetadataRoute.Sitemap =>
      snap.docs
        .filter((d) => {
          const slug = d.id || '';
          return slug.length > 0 && /^[a-zA-Z0-9_-]+$/.test(slug);
        })
        .map((d) => {
          const data = d.data() as { slug?: string; updatedAt?: { toDate?: () => Date }; createdAt?: { toDate?: () => Date } };
          const slug = (data.slug && /^[a-zA-Z0-9_-]+$/.test(data.slug)) ? data.slug : d.id;
          const lastModified =
            (data.updatedAt && typeof data.updatedAt.toDate === 'function' && data.updatedAt.toDate()) ||
            (data.createdAt && typeof data.createdAt.toDate === 'function' && data.createdAt.toDate()) ||
            now;
          return {
            url: `${SITE_URL}/${segment}/${encodeURIComponent(slug)}`,
            lastModified,
            changeFrequency: cf,
            priority,
          } as MetadataRoute.Sitemap[number];
        });

    dynamicEntries = [
      ...buildEntries(pontosSnap, 'pontos', 0.6, 'monthly'),
      ...buildEntries(hoteisSnap, 'estadias', 0.6, 'monthly'),
      ...buildEntries(eventosSnap, 'eventos', 0.7, 'weekly'),
      ...buildEntries(gastronomiaSnap, 'gastronomia', 0.6, 'monthly'),
      ...buildEntries(guiasSnap, 'guias', 0.5, 'monthly'),
      ...buildEntries(atrativosSnap, 'cavernas', 0.7, 'monthly'),
    ];
  } catch (error) {
    console.warn('[sitemap] Falha ao coletar dados dinâmicos do Firestore:', error);
  }

  return [...staticEntries, ...dynamicEntries];
}
