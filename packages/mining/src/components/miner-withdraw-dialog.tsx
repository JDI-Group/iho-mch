import type { Address, Hex } from 'viem'
import { fonts } from '@/config/fonts'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { formatEther } from '@hairy/ether-lib'
import { If, useAsyncCallback } from '@hairy/react-lib'
import { redirectTo } from '@hairy/utils'
import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, NumberInput, Tooltip } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useExtendOverlay } from '@overlastic/react'
import { encodeFunctionData, parseEther, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'

export interface MinerWithdrawDialogProps {
  balance: bigint
  account: Address
}

export function MinerWithdrawDialog(props: MinerWithdrawDialogProps) {
  const overlay = useExtendOverlay({ duration: 300 })
  const [amount, setAmount] = useState<number>()
  const [fueltank, setFueltank] = useState<boolean>(false)
  const { address } = useAccount()
  const tooltipContentRef = useRef<any>(null)
  const [openTooltip, setOpenTooltip] = useState<boolean>(false)

  const [loading, confirm] = useAsyncCallback(async () => {
    if (!amount || +amount === 0)
      return
    const parsedAmount = parseEther(String(amount))
    let to: Address
    let data: Hex

    if (fueltank) {
      to = chain.contracts.IHOFueltank.address
      data = encodeFunctionData({
        abi: ihoFueltankAbi,
        functionName: 'deposit',
        args: [props.account, zeroAddress, parsedAmount],
      })
    }
    else {
      to = address as Address
      data = '0x'
    }

    const hash = await writeIerc6551AccountExecute({
      address: props.account,
      args: [to, parsedAmount, data],
    })
    await client.waitForTransactionReceipt({ hash })

    transactionConfirmedToast(hash)

    overlay.resolve()
  })

  useOutsideClick(tooltipContentRef, () => setOpenTooltip(false))

  return (
    <Modal placement="center" className={fonts.barlow.className} isOpen={overlay.visible} onOpenChange={overlay.reject}>
      <ModalContent>
        <ModalHeader>
          Miner Withdraw
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <NumberInput
                classNames={{ inputWrapper: 'min-h-auto h-4 px-2', helperWrapper: 'pl-2 pb-0' }}
                placeholder="Enter the amount to withdraw"
                hideStepper
                isRequired
                size="sm"
                maxValue={+formatEther(props.balance, { zeromove: true })}
                disabled={loading}
                value={amount}
                onChange={value => typeof value === 'number' ? setAmount(value) : setAmount(undefined)}
              />
              <span className="absolute right-2 top-2 text-tiny text-default-500">{formatEther(props.balance)} MCH</span>
            </div>
            <If cond={!fueltank}>
              <div className="flex justify-center">
                <Icon icon="material-symbols:arrow-cool-down-rounded" />
              </div>
              <div
                className="text-small text-default-700 min-h-8 rounded-lg flex justify-center items-center px-2"
                onClick={() => {
                  redirectTo(`${chain.blockExplorers.default.url}/address/${address}`)
                }}
              >
                <If
                  cond={fueltank}
                  then={<Icon className="text-lg mr-1" icon="solar:electric-refueling-bold-duotone" />}
                  else={<Icon className="text-lg mr-1" icon="solar:wallet-bold-duotone" />}
                />
                <If
                  cond={fueltank}
                  // then={addresses.IHOFuel[5167004]}
                  else={address}
                />
                <Icon className="text-lg ml-1 mt-[1px]" icon="solar:round-arrow-right-up-broken" />
              </div>
            </If>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex-1 flex items-center gap-1">
            <Checkbox
              className="p-0"
              size="sm"
              disabled={loading}
              onChange={event => setFueltank(event.target.checked)}
            >
              Fill fueltank
            </Checkbox>
            <Tooltip
              content="Withdraw to the fueltank will be used to refuel your miner."
              isOpen={openTooltip}
              size="sm"
            >
              <div className="p-1" ref={tooltipContentRef} onClick={() => setOpenTooltip(!openTooltip)}>
                <Icon className="text-base mt-[1px]" icon="line-md:question-circle" />
              </div>
            </Tooltip>
          </div>
          <Button color="warning" size="sm" onPress={overlay.reject}>
            Cancel
          </Button>
          <Button color="primary" size="sm" onPress={confirm} isLoading={loading}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
