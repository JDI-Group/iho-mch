import { Button } from '@heroui/react'

export function DetailRewards() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-base">Mining Balance Of</div>
          <Button className="h-6" color="primary" size="sm">
            Withdraw
          </Button>
        </div>
        <div className="text-sm">12345.2456 MXC</div>
      </div>
      <div className="flex flex-col">
        <div className="text-base">Today's reward</div>
        <div className="text-sm">214 MXC</div>
      </div>
    </div>
  )
}
