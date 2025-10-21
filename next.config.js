/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config) => {
    config.externals.push('pino-pretty')
    return config
  }
}

module.exports = nextConfig
