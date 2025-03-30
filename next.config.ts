import type { NextConfig } from 'next'
import AutoImport from 'unplugin-auto-import/webpack'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(
      AutoImport({
        imports: [
          'react',
          {
            from: 'next/router',
            imports: [
              'useRouter',
            ],
          },
          {
            from: 'framer-motion',
            imports: [
              'motion',
            ],
          },
        ],
        dts: './types/auto-imports.d.ts',
        dirs: [
          'layouts/index.ts',
          'store/index.ts',
          'components/**',
          'hooks/**',
        ],
      }),
    )
    return config
  },
}

export default nextConfig
