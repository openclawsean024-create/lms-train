/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel 部署必須,避免 build time 取不到 env
  experimental: {},
};

module.exports = nextConfig;
