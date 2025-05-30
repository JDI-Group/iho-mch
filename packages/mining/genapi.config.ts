import { defineConfig } from '@genapi/core'

export default defineConfig({
  input: `${process.env.NEXT_PUBLIC_MINING_SERVICE_URL}/swagger/json`,
  pipeline: 'swag-fetch-ts',
  baseURL: 'process.env.NEXT_PUBLIC_MINING_SERVICE_URL',
  output: {
    main: 'apis/index.ts',
    type: 'apis/index.type.ts',
  },
})
