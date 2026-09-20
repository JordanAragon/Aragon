import type { MetadataRoute } from 'next';
import { siteLastModified, siteUrl } from './data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: siteLastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
