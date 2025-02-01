// next.config.ts
const nextConfig = {
  // Make basePath conditional based on environment
  basePath: process.env.NODE_ENV === 'production' ? '/healthera_ai' : '',
  images: {
    unoptimized: true,
    domains: ['api.placeholder.com']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig