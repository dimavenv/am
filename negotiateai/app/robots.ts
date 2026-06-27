import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The API and the post-payment result page have nothing to index.
      disallow: ["/api/", "/result"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
