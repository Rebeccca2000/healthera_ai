import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  // Make sure this exactly matches your GitHub repository name
  basePath: '/healthera_ai',
  images: {
    unoptimized: true,
  },
  // Add these two important configurations
  assetPrefix: '/healthera_ai/',
  trailingSlash: true,
  // Disable the experimental app directory since we're deploying to GitHub Pages
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

export default nextConfig