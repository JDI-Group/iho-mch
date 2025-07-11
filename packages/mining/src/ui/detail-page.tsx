import { useAsyncState } from '@hairy/react-lib'
import { Tab, Tabs } from '@heroui/react'

export function DetailPage() {
  const router = useRouter()

  const [{ value: miner, loading }] = useAsyncState(
    async () => getMinerAccount({ account: router.query.address as string }),
    [router.query.id],
    { immediate: true },
  )
  return (
    <>
      <section className="px-4 pb-4">
        <DetailStatusBar loading={loading} miner={miner} />
      </section>
      <section className="px-4">
        <Tabs aria-label="Tabs variants" size="md" variant="underlined">
          <Tab key="reward" title="Reward">
            <DetailRewards loading={loading} miner={miner} />
          </Tab>
          <Tab key="fuel-tank" title="Fuel tank">
            <DetailFueltank loading={loading} miner={miner} />
          </Tab>
        </Tabs>
      </section>
    </>
  )
}
