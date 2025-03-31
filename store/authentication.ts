import { defineStore } from '@hairy/react-lib'
import { createSiweMessage } from 'viem/siwe'

export const authentication = defineStore(
  {
    state: () => ({
      status: 'unauthenticated' as 'unauthenticated' | 'loading' | 'authenticated',
      address: '',
      token: '',
    }),
    actions: {
      getNonce: () => getUserNonce(),

      createMessage({ address, nonce, chainId }: any) {
      // Create a message to sign in with Ethereum to the app.
        const siwe = createSiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        })

        this.address = address

        return siwe
      },

      async verify({ message, signature }: any) {
        this.status = 'loading'
        try {
          const token = await postUserVerify({ message, signature })
          this.token = token
          this.status = 'authenticated'
          return true
        }
        catch {
          this.status = 'unauthenticated'
          return false
        }
      },

      async signOut() {
        this.status = 'unauthenticated'
        this.address = ''
      },
    },
  },
  { persistant: 'authentication' },
)
