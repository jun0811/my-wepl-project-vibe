import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/settings/", "/onboarding"],
    },
    sitemap: "https://wepl.vercel.app/sitemap.xml",
  };
}
