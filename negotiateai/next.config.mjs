/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // pdf-parse (and its pdfjs-dist dependency) must stay external so the
    // server bundle doesn't try to bundle the worker / node-only bits.
    serverComponentsExternalPackages: ["pdf-parse", "@react-pdf/renderer"],
  },
};

export default nextConfig;
