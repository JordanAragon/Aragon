import type { MetadataRoute } from 'next';
import { services } from './data/services';
import { siteLastModified, siteUrl } from './data/site';
import { work } from './data/work';

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number) => ({ url: `${siteUrl}${path}`, lastModified: siteLastModified, changeFrequency: 'monthly' as const, priority });
  return [
    page('', 1),
    page('/servicios', 0.9),
    ...services.map((s) => page(`/servicios/${s.slug}`, 0.85)),
    page('/como-trabajamos', 0.8),
    page('/trabajo', 0.8),
    ...work.map((w) => page(`/trabajo/${w.slug}`, 0.7)),
    page('/nosotros', 0.7),
    page('/preguntas', 0.7),
    page('/contacto', 0.8),
    page('/privacidad', 0.3),
  ];
}
