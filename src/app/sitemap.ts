import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://trivela.in'

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/arena`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/predictions`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/trivia`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/profile`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]
}
