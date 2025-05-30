import type { Chain } from 'viem'

export function transformNetworkToChain(network: any) {
  return {
    blockExplorers: network.explorer ? { default: network.explorer } : undefined,
    rpcUrls: { default: { http: [network.rpc] } },
    nativeCurrency: network.currency!,
    testnet: network.testnet,
    name: network.name!,
    icon: network.icon,
    id: network.id!,
  } as Chain
}
