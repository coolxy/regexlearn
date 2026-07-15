/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://regexlearn.com',
  generateRobotsTxt: true,
  outDir: './out',
};
