import type { StatsBatchItem } from '@/apis/index.type'
import { redirectTo } from '@hairy/utils'
import { Link } from '@heroui/link'

export interface HomeStatsBatchItemProps {
  item: StatsBatchItem
}
export function HomeStatsBatchItem(props: HomeStatsBatchItemProps) {
  function onToExplorer() {
    const url = `${chain.blockExplorers.default.url}/address/${Reflect.get(addresses, `IHOLockVaultV${props.item.batch}`)[chain.id]}`
    redirectTo(url, '_blank')
  }
  return (
    <div className="flex-col justify-center items-center">
      <div className='mb-4 flex justify-center'>
        <Link className="inline-flex justify-center text-2xl lg:text-4xl font-bold text-white hover:cursor-pointer border-b">
          IHO Batch A{props.item.batch}
        </Link>
      </div>
      <div className="text-center mb-6">
        Started {props.item.start}
      </div>
      <div className="w-full flex justify-center gap-4 lg:gap-8 flex-col sm:flex-row overflow-x-auto ">
        {props.item.stats.map(item => <HomeStatsItem key={item.name} item={item} batch={props.item.batch} />)}
      </div>
    </div>
  )
}
