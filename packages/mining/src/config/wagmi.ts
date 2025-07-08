import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { createConfig } from 'wagmi'

const wallets = getDefaultWallets().wallets
const connectors = connectorsForWallets(wallets, { appName: 'Starter', projectId: '019ca23f39a338bb3d0600cf1cae08fa' })

export const wagmiConfig = createConfig(<any>{
  chains: Object.values(chains),
  connectors,
  ssr: true,
})
