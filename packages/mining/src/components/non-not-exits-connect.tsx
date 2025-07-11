import type { PropsWithChildren } from 'react'
import { Unless } from '@hairy/react-lib'
import { Link } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useAccount, useConfig } from 'wagmi'

export function NonNotExitsConnect(props: PropsWithChildren) {
  const { isConnected, chainId } = useAccount()
  const { chains: wagmiChains } = useConfig()
  const isCurrentChainSupported = wagmiChains.some(
    chain => chain.id === chainId,
  )
  return (
    <Unless cond={isConnected && isCurrentChainSupported} else={props.children as any}>
      <div className="flex-1 flex flex-col justify-center items-center">
        <Icon fontSize={68} icon="devicon:web3js" />
        <div className="text-xl mt-4 text-center">
          Please connect your wallet to continue
        </div>
        <div className="flex gap-2 text-gray-500">
          <span className="text-tiny">New to Ethereum?</span>
          <Link className="text-tiny">Learn more about wallets</Link>
        </div>
        <div className="mt-6">
          <RainbowkitWidget />
        </div>
      </div>
    </Unless>
  )
}
