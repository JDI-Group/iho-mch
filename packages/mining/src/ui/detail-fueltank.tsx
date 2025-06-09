import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { DetailFueltankChart } from './detail-fueltank-chart'

export function DetailFueltank() {
  return (
    <div className="flex flex-col">
      <div className="mb-2 h-40">
        <DetailFueltankChart />
      </div>
      <div className="mb-2 flex gap-6">
        <div className="flex flex-col">
          <div className="text-base">Fuel tank Balance Of</div>
          <div className="text-sm">12345.2456 MXC</div>
        </div>
        <div className="flex flex-col">
          <div className="text-base">Fuel gain percentage</div>
          <div className="inline-flex items-center text-sm text-success">
            <Icon key="up" height={12} icon="solar:arrow-right-up-linear" width={12} />
            <span>200%</span>
          </div>
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        <Button className="h-6" color="primary" size="sm">
          Deposit
        </Button>
        <Button className="h-6 bg-yellow-500" color="danger" size="sm">
          Withdraw
        </Button>
      </div>

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
