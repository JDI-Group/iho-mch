import { Button, Card, CardBody, CardHeader, Chip, Divider, Image, Tab, Tabs } from '@heroui/react'
import { Icon } from '@iconify/react'

function Page() {
  return (
    <layouts.default>
      <section className="px-4 pb-4">
        <div className="flex gap-2 mb-4">
          <Image
            src="https://heroui.com/images/album-cover.png"
            alt="Woman listing to music"
            className="object-cover"
            height={70}
            width={70}
          />
          <div className="flex-1 flex flex-col">
            <span className="text-lg">Bluetooth app name</span>
            <div className="flex gap-1 mb-1">
              <Chip size="sm" className="h-[18px] text-tiny">Headset</Chip>
              <Chip size="sm" className="h-[18px] text-tiny">Virtual</Chip>
            </div>
            <Chip size="sm" className="h-[18px] text-tiny bg-default-700 text-default-50 px-2">
              <div className="flex items-center gap-1">
                <span>0xcEb9...cBDf</span>
                <Icon icon="solar:copy-bold-duotone" />
              </div>
            </Chip>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex justify-end">
              <Chip className="p-0 border-0" color="success" variant="dot">
                Online
              </Chip>
            </div>
            <div className="flex items-center gap-1 mb-[2px] mr-2">
              <Icon className="text-sm" icon="solar:clock-circle-outline" />
              <div className="text-sm">3h / 4min</div>
            </div>
          </div>
        </div>
        <span>It's day one of a healthier, smarter, better you. You're full of zest and good intentions. You woke up at 5am to run before work, you read a book in your lunchbreak.
        </span>
      </section>
      <section className="px-4">
        <Tabs aria-label="Tabs variants" size="md" variant="underlined">
          <Tab key="reward" title="Reward">
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
          </Tab>
          <Tab key="fuel-tank" title="Fuel tank">

          </Tab>
        </Tabs>
      </section>
    </layouts.default>
  )
}

export default Page
