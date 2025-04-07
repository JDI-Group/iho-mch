/* eslint-disable ts/ban-ts-comment */
import { chains } from '@harsta/client'
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'

import { createConfig } from 'wagmi'

export const rainbowWallets = getDefaultWallets().wallets
export const wagmiConnectors = connectorsForWallets(rainbowWallets, { appName: 'Starter', projectId: ' ' })

// @ts-expect-error
export const wagmiConfig = createConfig({
  chains: process.env.NEXT_PUBLIC_NETWORK === 'moonchain_geneva' ? [chains.moonchain_geneva] : [chains.moonchain],
  connectors: wagmiConnectors,
  ssr: true,
})
