import { DetailFuelTank } from '@/ui/detail-fuel-tank'
import { DetailRewards } from '@/ui/detail-rewards'
import { DetailStatusBar } from '@/ui/detail-status-bar'
import { Tab, Tabs } from '@heroui/react'

function Page() {
  return (
    <layouts.default>
      <section className="px-4 pb-4">
        <DetailStatusBar />
      </section>
      <section className="px-4">
        <Tabs aria-label="Tabs variants" size="md" variant="underlined">
          <Tab key="reward" title="Reward">
            <DetailRewards />
          </Tab>
          <Tab key="fuel-tank" title="Fuel tank">
            <DetailFuelTank />
          </Tab>
        </Tabs>
      </section>
    </layouts.default>
  )
}

export default Page
