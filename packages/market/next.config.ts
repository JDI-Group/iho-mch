import type { NextConfig } from 'next'
import AutoImport from 'unplugin-auto-import/webpack'

const nextConfig: NextConfig = {
  reactStrictMode: false,
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
          {
            from: 'clsx',
            imports: [
              ['default', 'clsx'],
            ],
          },
        ],
        dts: './types/auto-imports.d.ts',
        dirs: [
          'layouts/index.ts',
          'store/index.ts',
          'generated/index.ts',
          'components/**',
          'ui/**',
          'hooks/**',
          'utils/**',
          'apis/index.ts',
        ],
      }),
    )
    return config
  },
}

export default nextConfig
