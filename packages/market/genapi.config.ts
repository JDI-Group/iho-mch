import { defineConfig } from '@genapi/core'

export default defineConfig({
  input: `${process.env.NEXT_PUBLIC_MARKET_SERVICE_URL}/swagger/json`,
  pipeline: 'swag-fetch-ts',
  baseURL: 'process.env.NEXT_PUBLIC_MARKET_SERVICE_URL!',
  output: {
    main: 'src/apis/index.ts',
    type: 'src/apis/index.type.ts',
  },
})
