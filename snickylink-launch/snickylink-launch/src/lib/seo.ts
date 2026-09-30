/**
 * Single source of truth for SEO values.
 * Set VITE_SITE_URL in Vercel (Project Settings > Environment Variables)
 * to your real domain, e.g. https://snickylink.com
 */
const rawSiteUrl: string = import.meta.env["VITE_SITE_URL"] ?? "https://snickylink.com";

export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

export const SEO = {
  name: "Snickylink",
  tagline: "More Than a Chat",
  title: "Snickylink: A Daily Game for Couples | More Than a Chat",
  description:
    "You already chat. Snickylink turns it into something you do together: small daily challenges for you and your person, and a little world that grows with every one. Join the waitlist.",
  ogTitle: "Snickylink: More Than a Chat",
  ogDescription:
    "Two sparks. Four shared moments. One little world that only exists because you both showed up.",
  themeColor: "#3A1620",
  image: `${SITE_URL}/og-image.png`,
  imageAlt: "Snickylink: More Than a Chat. A daily game for couples.",
  logo: `${SITE_URL}/snickylink-logo.png`,
} as const;

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SEO.name,
      url: SITE_URL,
      logo: SEO.logo,
      slogan: SEO.tagline,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SEO.name,
      description: SEO.description,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};
