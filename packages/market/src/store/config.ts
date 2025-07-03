import { defineStore } from '@hairy/react-lib'

export const config = defineStore(
  {
    state: () => ({
      inviter: undefined as string | undefined,
      batch: 0,
      currentBatch: Number(process.env.NEXT_PUBLIC_MARKET_BATCH),
    }),
    getters: {
      isLasted() {
        return this.batch === Number(process.env.NEXT_PUBLIC_MARKET_BATCH)
      },
    },
  },
  { persist: 'config' },
)
