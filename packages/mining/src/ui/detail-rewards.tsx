import type { Miner } from '@/apis/index.type'
import type { Address } from 'viem'
import { formatEther } from '@hairy/ether-lib'
import { useAsyncCallback, useAsyncState } from '@hairy/react-lib'
import { addToast, Button } from '@heroui/react'
import { useOverlayInject } from '@overlastic/react'
import dayjs from 'dayjs'

export interface DetailRewardsProps {
  miner?: Miner
  loading?: boolean
}

export function DetailRewards(props: DetailRewardsProps) {
  const openMinerWithdrawDialog = useOverlayInject(MinerWithdrawDialog)
  // Collect data for seven days
  const defaultDaysRecords = [
    { date: dayjs().subtract(6, 'day').format('MM/DD'), reward: 0n },
    { date: dayjs().subtract(5, 'day').format('MM/DD'), reward: null },
    { date: dayjs().subtract(4, 'day').format('MM/DD'), reward: null },
    { date: dayjs().subtract(3, 'day').format('MM/DD'), reward: null },
    { date: dayjs().subtract(2, 'day').format('MM/DD'), reward: null },
    { date: dayjs().subtract(1, 'day').format('MM/DD'), reward: null },
    { date: dayjs().format('MM/DD'), reward: null },
  ]

  const [{ value: balance }, reloadBalance] = useAsyncState(
    async () => {
      if (!props.miner?.account)
        return 0n
      return client.getBalance({
        address: props.miner.account as `0x${string}`,
      })
    },
    [props.miner?.account],
  )

  const [withdrawLoading, withdraw] = useAsyncCallback(
    async () => {
      if (!balance || balance === 0n) {
        addToast({
          title: 'Withdraw failed',
          description: 'You don\'t have any amount to withdraw',
          color: 'warning',
        })
        return
      }
      await openMinerWithdrawDialog({ balance: balance!, account: props.miner!.account as Address })
      await reloadBalance()
    },
  )

  return (
    <div className="flex flex-col">
      <div className="mb-2 h-40 relative">
        <DetailRewardsChart data={defaultDaysRecords} />
      </div>
      <div className="mb-2 flex gap-6">
        <div className="flex flex-col">
          <div className="text-base">Mining Balance Of</div>
          <div className="text-sm">{formatEther(balance)} MXC</div>
        </div>
        <div className="flex flex-col">
          <div className="text-base">Today's reward</div>
          <div className="text-sm">214 MXC</div>
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        <Button className="h-6" color="primary" size="sm" onPress={withdraw} isLoading={withdrawLoading}>
          Withdraw
        </Button>
      </div>
    </div>
  )
}
