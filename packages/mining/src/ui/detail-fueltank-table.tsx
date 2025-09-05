import type { Key } from 'react'
import type { Address } from 'viem'
import { formatEther } from '@hairy/ether-lib'
import { useAsyncState, useEventBus } from '@hairy/react-lib'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import dayjs from 'dayjs'
import Countdown from 'react-countdown'
import { encodeFunctionData } from 'viem'

export interface DetailFueltankTableProps {
  address: string
}

export function DetailFueltankTable(props: DetailFueltankTableProps) {
  const { address } = props
  const [{ value: unlocks = [] }, reloadUnlocks] = useAsyncState(
    async () => {
      const unlocks = await readIhoFueltankGetUnlockCoins({ args: [address as Address] })
      return unlocks.filter(coin => coin.amount > 0n)
    },
    [address],
  )

  async function claim(index: bigint) {
    const data = encodeFunctionData({
      abi: ihoFueltankAbi,
      functionName: 'claim',
      args: [index],
    })
    const hash = await writeIerc6551AccountExecute({
      address: address as Address,
      args: [
        chain.contracts.IHOFueltank.address,
        0n,
        data,
      ],
    })

    await transactionWaitingReceipt(hash)
    await transactionConfirmedToast(hash)
    await reloadUnlocks()
  }

  function renderCell(unlock: typeof unlocks[number], key: Key) {
    const cellValue = unlock[key as keyof typeof unlock] as any
    const unlocktime = dayjs.unix(Number(unlock.unlocktime))
    const locked = dayjs().isBefore(unlocktime)
    switch (key) {
      case 'unlocktime':
        return unlocktime.format('MM/DD HH:mm')
      case 'amount':
        return `${formatEther(cellValue)} MCH`
      case 'status':
        return locked
          ? (
              <span className="text-tiny h-4 text-slate-500">
                Locked in
              </span>
            )
          : (
              <span className="text-tiny h-4 text-yellow-500">
                Unclaimed
              </span>
            )
      case 'actions':
        return locked
          ? (
              <Button className="h-6" isDisabled size="sm">
                <Countdown
                  date={unlocktime.valueOf()}
                  renderer={({ total }) => {
                    return dayjs.duration(total).format('D[d] H:mm:ss')
                  }}
                />
              </Button>
            )
          : (
              <Button onPress={() => claim(unlock.index)} className="h-6" color="primary" size="sm">
                Claim
              </Button>
            )
      default:
        return cellValue
    }
  }

  useEventBus('fueltank-table:reload').on(reloadUnlocks)

  return (
    <>
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
          <TableColumn key="index">ID</TableColumn>
          <TableColumn key="unlocktime">Time</TableColumn>
          <TableColumn key="amount">Balance</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody items={unlocks} emptyContent={<span className="text-sm">No rows to display.</span>}>
          {item => (
            <TableRow key={item.index}>
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
