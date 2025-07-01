import type { StatsBatchItem } from '@/apis/index.type'

export interface HomeStatsBatchItemProps {
  item: StatsBatchItem
}
export function HomeStatsBatchItem(props: HomeStatsBatchItemProps) {
  return (
    <div className="flex-col justify-center items-center">
      <div className="flex justify-center text-2xl lg:text-4xl font-bold mb-4">
        IHO Batch A{props.item.batch}
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
