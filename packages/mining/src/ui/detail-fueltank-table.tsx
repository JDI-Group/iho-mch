import type { Address } from 'viem'
import { useAsyncState } from '@hairy/react-lib'
import { Button, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { Key } from 'react'
import dayjs from 'dayjs'
import { formatEther } from '@hairy/ether-lib'

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

  function renderCell(unlock: typeof unlocks[number], key: Key) {
    const cellValue = unlock[key as keyof typeof unlock] as any
    switch (key) {
      
      case "timestamp":
        return dayjs.unix(Number(cellValue)).format("MM/DD HH:mm");
      case 'amount':
        return formatEther(cellValue)
      case "status":
        return dayjs.unix(Number(cellValue)).isAfter(dayjs()) ? 'Expired' : 'Active';
      case "actions":
        return 1;
      default:
        return cellValue;
    }
  }

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
          <TableColumn key="timestamp">Time</TableColumn>
          <TableColumn key="amount">Balance</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody items={unlocks}>
          {(item) => (
            <TableRow key={item.index}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
