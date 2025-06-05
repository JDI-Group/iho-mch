import { Unless, useAsyncState } from '@hairy/react-lib'
import { Spinner } from '@heroui/react'
import { useMount } from 'react-use'
import { getAbiItem } from 'viem'
import { useAccount } from 'wagmi'

export function HomePage() {
  const { address } = useAccount()

  const [{ value: miners = [], loading }, reloadMiners] = useAsyncState(
    async () => {
      const logs = await client.getLogs({
        event: getAbiItem({ abi: ihoMiningAbi, name: 'Registered' }),
        address: addresses.IHOMining[5167004],
        toBlock: 'latest',
        fromBlock: 0n,
      })
      return logs.map(log => log.args)
    },
    [address],
    { immediate: true },
  )

  useMount(reloadMiners)

  return (
    <>
      <section className="px-4 mb-4">
        <HomeRevenueCard />
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
                name={miner.name || 'Unnamed Device'}
                id={miner.mac!}
              />
            ))}
            <HomeMiningIncrease onRegistered={reloadMiners} />
          </div>
        </Unless>
      </section>
    </>
  )
}
