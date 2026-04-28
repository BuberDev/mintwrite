import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                // Standard crawlers — index public pages, block app/API routes
                userAgent: '*',
                allow: [
                    '/',
                    '/pricing',
                    '/demo',
                    '/sign-in',
                    '/sign-up',
                    '/forgot-password',
                    '/reset-password',
                ],
                disallow: [
                    '/api/',
                    '/dashboard',
                    '/generate/',
                    '/history',
                    '/billing',
                    '/account',
                    '/projects/',
                ],
            },
            {
                // OpenAI GPTBot — allow indexing for ChatGPT / AI search
                userAgent: 'GPTBot',
                allow: [
                    '/',
                    '/pricing',
                    '/demo',
                ],
                disallow: ['/api/', '/dashboard', '/generate/', '/history', '/billing', '/account', '/projects/'],
            },
            {
                // Anthropic ClaudeBot — allow indexing for Claude AI search
                userAgent: 'ClaudeBot',
                allow: [
                    '/',
                    '/pricing',
                    '/demo',
                ],
                disallow: ['/api/', '/dashboard', '/generate/', '/history', '/billing', '/account', '/projects/'],
            },
            {
                // Perplexity AI
                userAgent: 'PerplexityBot',
                allow: ['/', '/pricing', '/demo'],
            },
            {
                // Google extended — allows AI Overview training
                userAgent: 'Google-Extended',
                allow: ['/', '/pricing', '/demo'],
            },
            {
                // Meta AI
                userAgent: 'Meta-ExternalAgent',
                allow: ['/', '/pricing', '/demo'],
            },
            {
                // Cohere AI
                userAgent: 'cohere-ai',
                allow: ['/', '/pricing', '/demo'],
            },
            {
                // You.com
                userAgent: 'YouBot',
                allow: ['/', '/pricing', '/demo'],
            },
        ],
        sitemap: 'https://mintwrite.com/sitemap.xml',
        host: 'https://mintwrite.com',
    }
}
