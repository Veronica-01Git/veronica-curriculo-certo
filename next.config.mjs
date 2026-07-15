/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "pdf-parse", "@react-pdf/renderer"],
  },
};

export default nextConfig;
