export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://koyyammarkaz.org';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/uploads/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
