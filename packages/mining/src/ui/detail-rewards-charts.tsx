/* eslint-disable react/no-unstable-default-props */
import { formatEther } from '@hairy/ether-lib'
import { If } from '@hairy/react-lib'
import { arange } from '@hairy/utils'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface DetailRewardsChartData {
  date: string
  reward: bigint | null
}

export interface DetailRewardsChartProps {
  data?: DetailRewardsChartData[]
}

export function DetailRewardsCharts(props: DetailRewardsChartProps) {
  const { data = [] } = props
  const total = data.reduce((acc, item) => acc + (item.reward || 0n), 0n)
  const formattedData = data.map((item, index) => ({
    date: item.date,
    reward: (item.reward || data[index + 1]?.reward || data[index - 1]?.reward) ? +formatEther(item.reward || 0, { delimiters: false }) : undefined,
  }))
  return (
    <>
      <If cond={total === 0n}>
        <p className="absolute left-4 text-default-500 text-sm">
          There is no data available
        </p>
      </If>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart margin={{ left: 18, right: -20 }} data={formattedData}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#70ADF8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#70ADF8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            tickLine={false}
            fontSize="12"
            dataKey="date"
            axisLine={{ stroke: 'rgba(0,0,0,0.5)' }}
          />
          <YAxis
            tickLine={false}
            fontSize="12"
            axisLine={{ stroke: 'rgba(0,0,0,0.5)' }}
            orientation="right"
            width={80}
            tickFormatter={value => value > 0 ? `${value} MXC` : ''}
          />

          <Area
            type="natural"
            dataKey="reward"
            stroke="#70ADF8"
            fill="url(#colorUv)"
            dot={false}
          />
          <CartesianGrid vertical={false} strokeDasharray="3 3" fillOpacity={0.1} horizontalCoordinatesGenerator={props => arange(1, 3).map(index => (props.height / 4) * index)} />
          <Tooltip
            formatter={value => [`${value} MXC`, 'Rewards']}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  )
}
