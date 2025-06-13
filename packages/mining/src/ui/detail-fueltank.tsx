import type { Miner } from '@/apis/index.type'
import type { Address } from 'viem'
import { formatEther } from '@hairy/ether-lib'
import { useAsyncCallback, useAsyncState, useEventBus } from '@hairy/react-lib'
import { Button } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useOverlayInject } from '@overlastic/react'
import { zeroAddress } from 'viem'
import { DetailFueltankChart } from './detail-fueltank-chart'
import { DetailFueltankTable } from './detail-fueltank-table'

export interface DetailFueltankProps {
  loading?: boolean
  miner?: Miner
}

export function DetailFueltank(props: DetailFueltankProps) {
  const { miner } = props
  const openMinerFueltankDialog = useOverlayInject(MinerFueltankDialog)
  const [{ value: balance = 0n }, reloadBalance] = useAsyncState(
    async () => {
      if (!miner?.account)
        return
      const args = [miner.account as Address, zeroAddress] as const
      return readIhoFueltankBalanceOf({ args })
    },
    [miner?.account],
  )
  const reloadFueltankTable = useEventBus('fueltank-table:reload').emit
  const [depositLoading, deposit] = useAsyncCallback(async () => {
    await openMinerFueltankDialog({ type: 'deposit', miner: miner! })
    await reloadBalance()
  })
  const [withdrawLoading, withdraw] = useAsyncCallback(async () => {
    await openMinerFueltankDialog({ type: 'withdraw', miner: miner! })
    await reloadBalance()
    reloadFueltankTable()
  })
  return (
    <div className="flex flex-col">
      <div className="mb-2 h-40">
        <DetailFueltankChart />
      </div>
      <div className="mb-2 flex gap-6">
        <div className="flex flex-col">
          <div className="text-base">Fuel tank Balance Of</div>
          <div className="text-sm">{formatEther(balance)} MXC</div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-base">
            <span>Dividend ratio</span>
            <QuestionTooltip content="The proportion will gradually decrease as the number of participants increases, and you can invest more MXC to obtain a higher proportion" />
          </div>
          <div className="inline-flex items-center text-sm text-success">
            <Icon key="up" height={12} icon="solar:arrow-right-up-linear" width={12} />
            <span>0.5%</span>
          </div>
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        <Button className="h-6" color="primary" size="sm" isLoading={depositLoading} onPress={deposit}>
          Deposit
        </Button>
        <Button className="h-6 bg-yellow-500" color="danger" size="sm" isLoading={withdrawLoading} onPress={withdraw}>
          Withdraw
        </Button>
      </div>

      <DetailFueltankTable address={miner?.account || ''} />
    </div>
  )
}
