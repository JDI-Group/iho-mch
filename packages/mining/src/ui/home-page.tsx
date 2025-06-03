import { Unless, useAsyncState } from '@hairy/react-lib'
import { Spinner } from '@heroui/react'
import { useMount } from 'react-use'
import { useAccount } from 'wagmi'

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

export function HomePage() {
  const { address } = useAccount()

  const [{ value: miners = [], loading }, reloadMiners] = useAsyncState(
    async () => {
      const filter = await client.createContractEventFilter({
        address: addresses.IHOMining[5167004],
        abi: ihoMiningAbi,
        eventName: 'Registered',
        args: { owner: address },
      })

      const logs = await client.getFilterLogs({ filter })
      return logs.map(log => log.args)
    },
    [address],
    { immediate: true },
  )

  useMount(reloadMiners)

  return (
    <>
      <section className="px-4 mb-4">
        <TrendCard
          title="Todays' Revenue"
          value="1,234.56"
          symbol="MXC"
          change="3.3%"
          changeType="positive"
          changeText=" vs yesterday"
          areaData={data}
          areaType="natural"
          areaKey="pv"
        />
      </section>
      <section className="px-4 mb-4">
        <div className="my-4">
          Your Devices
        </div>
        <Unless
          cond={loading}
          else={(
            <div className="h-20 flex items-center justify-center">
              <Spinner classNames={{ label: 'text-foreground mt-4' }} variant="wave" />
            </div>
          )}
        >
          <div className="grid grid-cols-[repeat(auto-fill,100px)] gap-4">
            {miners.map(miner => (
              <HomeMiningItem
                key={miner.account}
                src="https://heroui.com/images/hero-card.jpeg"
                name="Headset Plus"
                id="0xdef0"
              />
            ))}
            <HomeMiningIncrease />
          </div>
        </Unless>
      </section>
    </>
  )
}
