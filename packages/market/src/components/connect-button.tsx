import { shapes } from '@dicebear/collection'
import { Button } from '@heroui/button'
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export interface ConnectButtonProps {
  status?: boolean
}

export function ConnectButton({ status = true }: ConnectButtonProps) {
  const { isConnecting } = useAccount()
  return (
    <>
      <RainbowConnectButton.Custom>
        {({
          authenticationStatus,
          account,
          chain,
          openChainModal,
          openConnectModal,
          openAccountModal,
          connectModalOpen,
          mounted,
        }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading'
          const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')
          const connecting = isConnecting || connectModalOpen || authenticationStatus === 'loading'
          if (!connected) {
            return (
              <Button
                onPress={openConnectModal}
                className="w-full dark:bg-gray-200 dark:text-black"
                color="primary"
                isLoading={connecting}
              >
                Login
              </Button>
            )
          }
          if (chain?.unsupported) {
            return (
              <>
                <Button
                  onPress={openChainModal}
                  color="warning"
                  className="bg-[#FF494A] text-white text-sm font-bold gap-1 h-10"
                >
                  <span>Wrong network</span>
                  <Icon icon="solar:alt-arrow-down-bold" />
                </Button>
              </>
            )
          }
          if (status) {
            return (
              <Button className="flex-shrink-0 px-2 gap-0" radius="full" onPress={openAccountModal} variant="light">
                <Dicebear className="w-[24px] h-[24px] rounded-full mr-2" style={shapes} seed={account.address} />
                <span className="mr-1 max-xs:hidden">{account.displayName}</span>
                <Icon fontSize="16" icon="solar:alt-arrow-down-bold-duotone" />
              </Button>
            )
          }
        }}
      </RainbowConnectButton.Custom>
    </>
  )
}
