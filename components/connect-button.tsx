import { Else, If, Then, useStore } from '@hairy/react-lib'
import { Button } from '@heroui/button'
import { ConnectButton as RainbowConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export interface ConnectButtonProps {
  status?: boolean
}

export function ConnectButton({ status = true }: ConnectButtonProps) {
  const { openConnectModal, connectModalOpen } = useConnectModal()
  const { isConnecting, isConnected } = useAccount()
  const authentication = useStore(store.authentication)
  return (
    <>
      <If cond={isConnected}>
        <Then tag="div" className="rainbow-wrapper" cond={status && authentication.token}>
          <RainbowConnectButton chainStatus={{ smallScreen: 'none' }} />
        </Then>
        <Else
          tag={Button}
          onPress={openConnectModal}
          className="w-full dark:bg-gray-200 dark:text-black"
          color="primary"
          isLoading={isConnecting || connectModalOpen}
        >
          Login
        </Else>
      </If>
    </>
  )
}
