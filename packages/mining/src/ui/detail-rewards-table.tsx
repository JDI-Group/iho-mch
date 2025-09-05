import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'

export function DetailRewardsTable() {
  return (
    <>
      <div className="mb-2 text-base">
        Your Withdrawals
      </div>
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
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell># 5</TableCell>
            <TableCell>01/24/25</TableCell>
            <TableCell>100 MCH</TableCell>
            <TableCell className="text-tiny">
              <span className="text-tiny h-4 text-success-500">
                Withdrawn
              </span>
            </TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell># 5</TableCell>
            <TableCell>01/24/25</TableCell>
            <TableCell>100 MCH</TableCell>
            <TableCell>
              <span className="text-tiny h-4 text-success-500">
                Withdrawn
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}
