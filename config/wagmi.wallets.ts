import { metaMaskWallet as _metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import { getInjectedConnector } from './wagmi.connector'

export function metaMaskWallet(options: any) {
  const source = _metaMaskWallet(options)
  return {
    ...source,
    createConnector: getInjectedConnector({
      target: typeof window !== 'undefined' && (window.ethereum || undefined),
    }),
  }
}

export function moonBaseWallet(options: any) {
  const source = metaMaskWallet(options)
  source.iconUrl = 'https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo.svg'
  source.name = 'MoonBase'
  source.id = 'moon_base'
  source.iconBackground = '#FFFFFF'
  source.rdns = 'moonbase.mxc.com'
  return source
}
