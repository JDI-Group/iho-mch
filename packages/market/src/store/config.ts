import { defineStore } from '@hairy/react-lib'

export const config = defineStore(
  {
    state: () => ({
      inviter: undefined as string | undefined,
      batch: undefined as number | undefined,
    }),
  },
  { persist: 'config' },
)
