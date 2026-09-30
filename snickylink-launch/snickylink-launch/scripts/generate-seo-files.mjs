// Runs automatically before `build` (npm/bun "prebuild" hook).
// Writes public/robots.txt and public/sitemap.xml using your real domain.
// Domain priority: VITE_SITE_URL > SITE_URL > Vercel production URL > default.
import { writeFileSync, mkdirSync } from "node:fs";

const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

const site = (process.env.VITE_SITE_URL || process.env.SITE_URL || fromVercel || "https://snickylink.com").replace(/\/+$/, "");
const today = new Date().toISOString().slice(0, 10);

mkdirSync("public", { recursive: true });

writeFileSync(
  "public/robots.txt",
  `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`,
);

writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
);

console.log(`[seo] robots.txt + sitemap.xml generated for ${site}`);
