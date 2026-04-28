import { MetadataRoute } from 'next'

const BASE_URL = 'https://mintwrite.com'

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()

    return [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/pricing`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/demo`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/sign-up`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/sign-in`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
    ]
}
