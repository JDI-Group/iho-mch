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
          {
            from: '@iconify/react',
            imports: [
              'Icon',
            ],
          },
        ],
        dts: './types/auto-imports.d.ts',
        dirs: [
          'src/layouts/index.ts',
          'src/store/index.ts',
          'src/generated/index.ts',
          'src/components/**',
          'src/ui/**',
          'src/hooks/**',
          'src/utils/**',
          'src/apis/index.ts',
        ],
      }),
    )
    return config
  },
}

export default nextConfig
