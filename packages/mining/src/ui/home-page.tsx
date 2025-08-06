import { Unless, useAsyncState } from '@hairy/react-lib'
import { Alert, Link, Spinner } from '@heroui/react'
import { useAccount } from 'wagmi'

export function HomePage() {
  const { address } = useAccount()

  const [{ value: miners = [], loading }] = useAsyncState(
    async () => getMiner({ owner: address! }),
    [address],
    { immediate: true },
  )
  const ihoUrl = process.env.NEXT_PUBLIC_NETWORK === 'moonchain_geneva'
    ? 'testnet-iho.moonchain.com'
    : 'iho.moonchain.com'
  return (
    <>
      <section className="px-4 mb-4">
        <HomeRevenueCard />
      </section>
      <section className="px-4">
        <Alert className="items-center">
          <div>
            <span>IHO mining is only available for iho pledge. If you do not have the equipment yet, please go to </span>
            <Link className="inline" href={`https://${ihoUrl}`} target="_blank">{ihoUrl}</Link>
          </div>
        </Alert>
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
                address={miner.account}
                id={miner.mac!}
                src={miner.image}
              />
            ))}
            <HomeMiningIncrease />
          </div>
        </Unless>
      </section>
    </>
  )
}
