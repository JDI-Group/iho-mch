/* eslint-disable ts/ban-ts-comment */
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { createConfig } from 'wagmi'
import { metaMaskWallet, moonBaseWallet } from './wagmi.wallets'

export const rainbowWallets = getDefaultWallets().wallets

export const connectors = connectorsForWallets(
  [{
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet,
      moonBaseWallet,
      rainbowWallets[0].wallets[0],
      rainbowWallets[0].wallets[1],
      rainbowWallets[0].wallets[2],
      rainbowWallets[0].wallets[3],
      // rainbowWallets[0].wallets[4],
    ],
  }],
  {
    appName: 'Starter',
    projectId: '019ca23f39a338bb3d0600cf1cae08fa',
  },
)

// @ts-expect-error
export const wagmiConfig = createConfig({
  chains: process.env.NEXT_PUBLIC_NETWORK === 'moonchain_geneva' ? [chains.moonchainGeneva] : [chains.moonchain],
  connectors,
  ssr: true,
})
