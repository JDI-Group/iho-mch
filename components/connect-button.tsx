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
          account,
          chain,
          connectModalOpen,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading'
          const connected = ready && account && chain && (!authenticationStatus
            || authenticationStatus === 'authenticated')
          if (!connected) {
            return (
              <Button
                onPress={openConnectModal}
                className="w-full dark:bg-gray-200 dark:text-black"
                color="primary"
                isLoading={isConnecting || connectModalOpen}
              >
                Login
              </Button>
            )
          }
          if (chain?.unsupported) {
            return (
              <>
                <div className="hidden sm:block">
                  <Button onPress={openChainModal} className="bg-[#FF494A] text-white font-bold">
                    <span>Wrong network</span>
                    <MaterialSymbolsArrowForwardIosRounded />
                  </Button>
                </div>
                <div className="sm:hidden">
                  <Button size="sm" onPress={openChainModal} className="bg-[#FF494A] text-white font-bold">
                    <span>Network</span>
                    <MingcuteWarningFill width={18} height={18} />
                  </Button>
                </div>
              </>
            )
          }
          if (status) {
            return (
              <div className="rainbow-wrapper">
                <RainbowConnectButton accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} />
              </div>
            )
          }
        }}
      </RainbowConnectButton.Custom>
    </>
  )
}
