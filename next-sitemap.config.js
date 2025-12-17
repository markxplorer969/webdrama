/** @type {import('next-sitemap').IConfig } */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/static/'],
      },
    ],
  },
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  autoLastmod: true,
  exclude: ['/api/*', '/admin/*'],
  transform: async (config, path) => {
    // customize transformation for specific paths
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => {
    const result = [];
    
    // Add dynamic routes for drama pages
    result.push({
      loc: '/trending',
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    });
    
    result.push({
      loc: '/series',
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    });
    
    result.push({
      loc: '/search',
      changefreq: 'weekly',
      priority: 0.6,
      lastmod: new Date().toISOString(),
    });

    return result;
  },
};