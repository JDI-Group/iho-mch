import type { StatsItem } from '@/apis/index.type'
import { formatEther } from '@hairy/ether-lib'
import { Case, Else, If, Switch, Then, useStore } from '@hairy/react-lib'
import { redirectTo, riposte } from '@hairy/utils'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Image } from '@heroui/image'
import { Progress } from '@heroui/progress'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export interface HomeStatsItemProps {
  item: StatsItem
  batch: number
  start?: string
}
export function HomeStatsItem({ item: stat, batch, start }: HomeStatsItemProps) {
  const address = Reflect.get(addresses, `IHOLockVaultV${batch}`)[chain.id]
  const router = useRouter()
  const config = useStore(store.config)

  const isLastedThis = config.batch === batch
  const isLasted = config.batch === Number(process.env.NEXT_PUBLIC_MARKET_BATCH)

  function onToExplorer() {
    const url = `${chain.blockExplorers.default.url}/address/${address}`
    redirectTo(url, '_blank')
  }

  return (
    <Card className="w-full sm:max-w-[300px] lg:max-w-[300px] xl:max-w-[320px] xxl:max-w-[340px] flex-shrink-0 flex flex-col" key={stat.name}>
      <CardHeader className="pt-4 pb-2 flex flex-col items-start">
        <div className="mb-4 w-full items-center flex justify-between">
          <div className="flex gap-2">
            <If cond={start}>
              <If cond={!isLastedThis || isLasted}>
                <Chip size="sm" onClick={onToExplorer}>
                  <span className="border-b ">IHO Batch A{batch}#{address?.slice?.(0, 6)}</span>
                </Chip>
              </If>
              <Chip
                size="sm"
                className="font-bold"
                variant="flat"
                color={riposte(
                  [stat.status === 'starting', 'success'],
                  [stat.status === 'ending-soon', 'warning'],
                  [stat.status === 'completed', 'primary'],
                )}
              >
                {stat.status}
              </Chip>
            </If>
            <Chip
              className="hidden sm:inline-flex"
              size="lg"
              variant="flat"
              color={riposte(
                [stat.status === 'starting', 'success'],
                [stat.status === 'ending-soon', 'warning'],
                [stat.status === 'completed', 'primary'],
              )}
            >
              {stat.status}
            </Chip>
          </div>
          <span>#{stat.product}</span>
        </div>

        <h2 className="text-2xl font-semibold">{stat.name}</h2>
        <If cond={start}>
          <div className="w-full flex justify-between">
            <span>Batch Started at:</span>
            <span>{start}</span>
          </div>
        </If>
        <p className="text-lg text-default-500 line-clamp-2">{stat.description}</p>

      </CardHeader>

      <div className="flex-1" />
      <CardBody className="flex-none">
        <Image
          alt="Card background"
          width="100%"
          className="object-cover aspect-square"
          src={stat.image}
        />
        <div className="flex justify-between mt-3 mb-2">
          <span>Total Value Secured:</span>
          <span>
            {formatEther(stat.totalValueSecuredMXC)}
            MXC
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Participants:</span>
          <If cond={stat.status === 'ended'}>
            <Then tag="span">
              {stat.orders} / {stat.orders}
            </Then>
            <Else tag="span">
              {stat.orders} / {stat.target}
            </Else>
          </If>
        </div>
        <Progress
          color={riposte(
            [stat.status === 'starting', 'success'],
            [stat.status === 'ending-soon', 'warning'],
            [stat.status === 'completed', 'primary'],
          )}
          maxValue={stat.status === 'ended' ? stat.orders : stat.target}
          value={stat.orders}
        />
        <Switch value={stat.status}>
          <Case cond="starting">
            <If cond={!isLasted && isLastedThis}>
              <Then>
                <Button className="mt-6" radius="md" variant="flat">
                  Coming Soon
                </Button>
              </Then>
              <Else>
                <Button onPress={() => router.push(`/products/${stat.product}`)} className="mt-6" radius="md" color="success" variant="flat">
                  <u>In progress</u>
                </Button>
              </Else>
            </If>
          </Case>
          <Case cond="ending-soon">
            <Button onPress={() => router.push(`/products/${stat.product}`)} className="mt-6" radius="md" color="warning" variant="flat">
              <u>Get Yours Now</u>
            </Button>
          </Case>
          <Case cond="completed">
            <Button className="mt-6" radius="md" color="success" variant="flat" onPress={onToExplorer}>
              <u>Ended within {dayjs.duration(stat.confirmAt! - stat.createAt, 'seconds').format('HH[h] mm[m] ss[s]')}</u>
            </Button>
          </Case>
          <Case cond="ended">
            <Button className="mt-6" radius="md" color="success" variant="flat" onPress={onToExplorer}>
              <u>Ended within {dayjs.duration(stat.confirmAt! - stat.createAt, 'seconds').format('HH[h] mm[m] ss[s]')}</u>
            </Button>
          </Case>
        </Switch>
      </CardBody>
    </Card>
  )
}
