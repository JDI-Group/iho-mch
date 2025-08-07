import type { Miner } from '@/apis/index.type'
import type { Address, Hex } from 'viem'
import { fonts } from '@/config/fonts'
import { formatEther } from '@hairy/ether-lib'
import { If, useAsyncCallback, useAsyncState } from '@hairy/react-lib'
import { cover } from '@hairy/utils'
import { Alert, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, NumberInput, Radio, RadioGroup } from '@heroui/react'
import { useExtendOverlay } from '@overlastic/react'
import { encodeFunctionData, parseEther, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'

export interface MinerFueltankDialogProps {
  type: 'deposit' | 'withdraw'
  miner: Miner
}

export function MinerFueltankDialog(props: MinerFueltankDialogProps) {
  const { visible, resolve, reject } = useExtendOverlay({ duration: 300 })
  const { type, miner } = props

  return (
    <Modal placement="center" className={fonts.barlow.className} isOpen={visible} onOpenChange={reject}>
      <If
        cond={type === 'deposit'}
        then={<DepositFueltank miner={miner} onCancel={reject} onConfirm={resolve} />}
        else={<WithdrawFueltank miner={miner} onCancel={reject} onConfirm={resolve} />}
      />
    </Modal>
  )
}

export interface ContentProps {
  onConfirm: () => void
  onCancel: () => void
  miner: Miner
}

function DepositFueltank({ miner, onCancel, onConfirm }: ContentProps) {
  const [accountType, setAccountType] = useState<'wallet' | 'miner'>('wallet')
  // Implement deposit logic here
  const { address } = useAccount()

  const [{ value: walletBalance }] = useAsyncState(
    async () => client.getBalance({ address: address as `0x${string}` }),
    [address],
  )
  const [{ value: minerBalance }] = useAsyncState(
    async () => client.getBalance({ address: miner.account as `0x${string}` }),
    [miner.account],
  )
  const balance = accountType === 'wallet' ? walletBalance : minerBalance

  const [amount, setAmount] = useState<number>()

  const [loading, deposit] = useAsyncCallback(
    async () => {
      if (!amount || +amount === 0)
        return
      let hash: Hex

      const parsedAmount = parseEther(String(amount))

      const parameters = {
        args: [
          miner.account as Address,
          zeroAddress,
          parsedAmount,
        ],
        value: parsedAmount,
      } as const

      const data = encodeFunctionData({
        abi: ihoFueltankAbi,
        functionName: 'deposit',
        args: parameters.args,
      })

      if (accountType === 'miner') {
        hash = await writeIerc6551AccountExecute({
          address: miner.account as Address,
          args: [
            chain.contracts.IHOFueltank.address,
            parsedAmount,
            data,
          ],
        })
      }
      else {
        hash = await writeIhoFueltankDeposit(parameters)
      }

      await transactionWaitingReceipt(hash)
      await transactionConfirmedToast(hash)

      onConfirm()
    },
  )

  return (
    <ModalContent>
      <ModalHeader className="flex flex-col gap-1 pb-2">
        Deposit to Fuel Tank
      </ModalHeader>
      {/* <Input /> */}
      <ModalBody className="pt-0">
        <div>
          <div className="flex justify-between mb-2">
            <RadioGroup value={accountType} onChange={event => setAccountType(event.target.value as 'wallet' | 'miner')} className="gap-1" size="sm" label="Select your account" orientation="horizontal">
              <Radio value="wallet">Wallet</Radio>
              <Radio value="miner">Miner</Radio>
            </RadioGroup>
            <div className="flex items-end pb-[1px] pr-2 text-tiny text-default-500">
              {cover(accountType === 'wallet' ? address! : miner.account, [6, 4, 6])}
            </div>
          </div>
          <div className="relative">
            <NumberInput
              classNames={{ inputWrapper: 'min-h-auto h-4 px-2', helperWrapper: 'pl-2 pb-0' }}
              placeholder="Enter the amount to deposit"
              hideStepper
              isRequired
              size="sm"
              maxValue={+formatEther(balance, { zeromove: true })}
              disabled={false}
              value={amount}
              onChange={value => typeof value === 'number' ? setAmount(value) : setAmount(undefined)}
            />
            <span className="absolute right-2 top-2 text-tiny text-default-500">{formatEther(balance)} MXC</span>
          </div>

        </div>
      </ModalBody>
      <ModalFooter className="pt-2">
        <Button color="warning" size="sm" onPress={onCancel}>
          Cancel
        </Button>
        <Button color="primary" size="sm" isLoading={loading} onPress={deposit}>
          Confirm
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}
function WithdrawFueltank({ miner, onCancel, onConfirm }: ContentProps) {
  const [{ value: balance }] = useAsyncState(
    async () => readIhoFueltankBalanceOf({ args: [miner.account as Address, zeroAddress] }),
    [miner.account],
  )
  const [amount, setAmount] = useState<number>()

  const [loading, withdraw] = useAsyncCallback(
    async () => {
      if (!amount || +amount === 0)
        return
      const parsedAmount = parseEther(String(amount))

      const data = encodeFunctionData({
        abi: ihoFueltankAbi,
        functionName: 'cancel',
        args: [
          zeroAddress,
          parsedAmount,
        ],
      })

      const hash = await writeIerc6551AccountExecute({
        address: miner.account as Address,
        args: [
          chain.contracts.IHOFueltank.address,
          0n,
          data,
        ],
      })

      await transactionWaitingReceipt(hash)
      await transactionConfirmedToast(hash)

      onConfirm()
    },
  )

  return (
    <ModalContent>
      <ModalHeader className="flex flex-col gap-1 pb-2">
        Withdraw from Fuel Tank
      </ModalHeader>
      {/* <Input /> */}
      <ModalBody className="pt-0">
        <div className="relative">
          <NumberInput
            classNames={{ inputWrapper: 'min-h-auto h-4 px-2', helperWrapper: 'pl-2 pb-0' }}
            placeholder="Enter the amount to deposit"
            hideStepper
            isRequired
            size="sm"
            maxValue={+formatEther(balance, { zeromove: true })}
            disabled={false}
            value={amount}
            onChange={value => typeof value === 'number' ? setAmount(value) : setAmount(undefined)}
          />
          <span className="absolute right-2 top-2 text-tiny text-default-500">{formatEther(balance)} MXC</span>
        </div>
        <Alert
          classNames={{ description: 'ml-0' }}
          className="items-center p-2"
          color="warning"
          description="Withdrawals will reduce the fuel tank amount and enter a lock up period of nearly 30 days. After the lock up period, you can claim it."
        />
      </ModalBody>
      <ModalFooter className="pt-2">
        <Button color="warning" size="sm" onPress={onCancel}>
          Cancel
        </Button>
        <Button color="primary" size="sm" isLoading={loading} onPress={withdraw}>
          Confirm
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}
