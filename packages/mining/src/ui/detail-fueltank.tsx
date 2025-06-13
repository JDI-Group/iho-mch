import type { Miner } from '@/apis/index.type'
import type { Address } from 'viem'
import { formatEther } from '@hairy/ether-lib'
import { useAsyncCallback, useAsyncState } from '@hairy/react-lib'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
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

  const [depositLoading, deposit] = useAsyncCallback(async () => {
    await openMinerFueltankDialog({ type: 'deposit', miner: miner! })
    await reloadBalance()
  })
  const [withdrawLoading, withdraw] = useAsyncCallback(async () => {
    await openMinerFueltankDialog({ type: 'withdraw', miner: miner! })
    await reloadBalance()
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

      <DetailFueltankTable address={miner!.account} />
      <div className="mb-2 text-base">Your Withdraws</div>
      <Table
        aria-label="Example static collection table"
        classNames={{
          wrapper: ['shadow-none p-0'],
          th: ['px-3 bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
          td: ['p-2'],
        }}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Time</TableColumn>
          <TableColumn>Balance</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell># 5</TableCell>
            <TableCell>01/24/25</TableCell>
            <TableCell>100 MXC</TableCell>
            <TableCell className="text-tiny">
              <span className="text-tiny h-4 text-yellow-500">
                Unclaimed
              </span>
            </TableCell>
            <TableCell>
              <Button className="h-6" color="primary" size="sm">
                Claim
              </Button>
            </TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell># 5</TableCell>
            <TableCell>01/24/25</TableCell>
            <TableCell>100 MXC</TableCell>
            <TableCell>
              <span className="text-tiny h-4 text-slate-500">
                Locked in
              </span>
            </TableCell>
            <TableCell>
              <Button className="h-6" isDisabled size="sm">
                48:00:21
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
