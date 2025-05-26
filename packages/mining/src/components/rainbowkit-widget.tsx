import type { ButtonProps } from '@heroui/react'
import { shapes } from '@dicebear/collection'
import { If } from '@hairy/react-lib'
import { Button } from '@heroui/react'
import { Icon } from '@iconify/react'
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useConnect } from 'wagmi'
import { Dicebear } from './dicebear'

export interface RainbowkitWidgetProps {
  account?: boolean
  chain?: boolean
  size?: ButtonProps['size']
}

export function RainbowkitWidget({
  size = 'sm',
  account: showAccount = true,
  chain: showChain = true,
}: RainbowkitWidgetProps) {
  const wagmiAccount = useAccount()
  const connect = useConnect()

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        connectModalOpen,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected = ready
          && account
          && chain
          && (!authenticationStatus || authenticationStatus === 'authenticated')
        const connecting = wagmiAccount.isConnecting
          || wagmiAccount.isReconnecting
          || connectModalOpen
          || authenticationStatus === 'loading'
          || connect.isPending
        if (!connected) {
          return (
            <Button
              onPress={openConnectModal}
              className=" dark:bg-gray-200 dark:text-black"
              color="primary"
              isLoading={connecting}
              size="sm"
            >
              Connect Wallet
            </Button>
          )
        }
        if (chain?.unsupported) {
          return (
            <Button
              onPress={openChainModal}
              className="bg-[#FF494A] text-white font-bold gap-1"
              size={size}
            >
              <span>Wrong network</span>
              <Icon icon="solar:alt-arrow-down-bold" />
            </Button>
          )
        }

        return (
          <div className="flex gap-2">
            <If cond={showChain}>
              <Button
                onPress={openChainModal}
                style={{ display: 'flex', alignItems: 'center' }}
                variant="light"
                className="flex-shrink-0 px-2 gap-0"
                radius="full"
                size={size}
              >
                <If
                  cond={chain.hasIcon}
                  style={{ background: chain.iconBackground }}
                  className="mr-2 w-6 h-6 rounded-full flex-shrink-0"
                  tag="div"
                >
                  <If
                    cond={chain.iconUrl}
                    tag="img"
                    alt={chain.name ?? 'Chain icon'}
                    src={chain.iconUrl}
                    style={{ width: 24, height: 24 }}
                  />
                </If>
                <span className="mr-1 max-sm:hidden">{chain.name}</span>
                <Icon fontSize="16" icon="solar:alt-arrow-down-bold-duotone" />
              </Button>
            </If>
            <If cond={showAccount}>
              <Button className="flex-shrink-0 px-2 gap-0" radius="full" size={size} onPress={openAccountModal} variant="light">
                <Dicebear className="w-[24px] h-[24px] rounded-full mr-2" style={shapes} seed={account.address} />
                <span className="mr-1 max-xs:hidden">{account.displayName}</span>
                <Icon fontSize="16" icon="solar:alt-arrow-down-bold-duotone" />
              </Button>
            </If>
          </div>
        )
      }}
    </RainbowConnectButton.Custom>
  )
}
