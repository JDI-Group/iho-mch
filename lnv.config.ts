import { defineConfig } from '@hairy/lnv'

const config = defineConfig({
  /**
   * Environment variable injection, applied to all LNV scripts
   */
  injects: {

    /**
     * Default loaded environment variable entries
     */
    entries: ['vault'],
  },
})

export default config
