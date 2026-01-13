/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'pino-std-serializers');
    return config;
  },
}

module.exports = nextConfig
