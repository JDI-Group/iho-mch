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
        <Then cond={status && authentication.token}>
          <div className="rainbow-wrapper">
            <RainbowConnectButton chainStatus={{ smallScreen: 'none' }} />
          </div>
        </Then>
        <Else>
          <Button
            onPress={openConnectModal}
            className="w-full dark:bg-gray-200 dark:text-black"
            color="primary"
            isLoading={isConnecting || connectModalOpen}
          >
            Login
          </Button>
        </Else>
      </If>
    </>
  )
}
