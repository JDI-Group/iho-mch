import type { StatsBatchItem } from '@/apis/index.type'
import { Else, If, Then, useStore } from '@hairy/react-lib'
import { redirectTo } from '@hairy/utils'
import { Link } from '@heroui/link'

export interface HomeStatsBatchItemProps {
  item: StatsBatchItem
}
export function HomeStatsBatchItem(props: HomeStatsBatchItemProps) {
  const address = Reflect.get(addresses, `IHOLockVaultV${props.item.batch}`)[chain.id]
  const config = useStore(store.config)

  const isLasted = config.batch === Number(process.env.NEXT_PUBLIC_MARKET_BATCH)
  const isLastedThis = config.batch === props.item.batch

  function onToExplorer() {
    const url = `${chain.blockExplorers.default.url}/address/${address}`
    redirectTo(url, '_blank')
  }
  return (
    <div className="inline-flex flex-col justify-center items-center pb-12">
      <div className="mb-4 flex flex-col items-center justify-center">
        <h3 className="inline-flex justify-center text-2xl lg:text-4xl font-bold text-white mb-2">
          IHO Batch A{props.item.batch}
        </h3>
        <If cond={!isLastedThis || isLasted}>
          <Then>
            <Link className="text-default-500 hover:cursor-pointer border-b" onClick={onToExplorer}>
              {address}
            </Link>
          </Then>
          <Else cond={config.batch}>
            <span>-</span>
          </Else>
        </If>

      </div>
      <div className="text-center mb-6">
        Started {props.item.start}
      </div>
      <div className="inline-flex justify-center gap-4 lg:gap-8 flex-col sm:flex-row overflow-x-auto ">
        {props.item.stats.map(item => <HomeStatsItem key={item.name} item={item} batch={props.item.batch} />)}
      </div>
    </div>
  )
}
