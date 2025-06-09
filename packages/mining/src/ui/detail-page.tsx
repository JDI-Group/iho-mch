import { useAsyncState } from '@hairy/react-lib'
import { Tab, Tabs } from '@heroui/react'
import { getAbiItem } from 'viem'

export function DetailPage() {
  const router = useRouter()

  const [{ value: _device }] = useAsyncState(
    async () => {
      const token = await readIhoMiningTokenOf({
        args: [router.query.id as string],
      })
      const logs = await client.getLogs({
        event: getAbiItem({ abi: ihoMiningAbi, name: 'Registered' }),
        address: addresses.IHOMining[5167004],
        toBlock: 'latest',
        fromBlock: 0n,
        args: {
          token: token.tokenContract,
          tokenId: token.tokenId,
        },
      })
      return logs.map(log => log.args)[0]
    },
    [router.query.id],
    { immediate: true },
  )

  return (
    <>
      <section className="px-4 pb-4">
        <DetailStatusBar />
      </section>
      <section className="px-4">
        <Tabs aria-label="Tabs variants" size="md" variant="underlined">
          <Tab key="reward" title="Reward">
            <DetailRewards />
          </Tab>
          <Tab key="fuel-tank" title="Fuel tank">
            <DetailFueltank />
          </Tab>
        </Tabs>
      </section>
    </>
  )
}
