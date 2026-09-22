import type { MetadataRoute } from 'next';
import { siteLastModified, siteUrl } from './data/site';
import { work } from './data/work';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: siteLastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...work.map((item) => ({
      url: `${siteUrl}/work/${item.slug}`,
      lastModified: siteLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
