import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export for Hostinger shared hosting (no Node.js required)
  output: 'export',
  images: { unoptimized: true },

  // Bake demo mode into the build — no API keys needed at runtime
  env: {
    NEXT_PUBLIC_DEMO_MODE: 'true',
  },
}

export default nextConfig
