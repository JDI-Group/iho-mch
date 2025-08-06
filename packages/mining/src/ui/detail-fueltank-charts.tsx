import { formatEther } from '@hairy/ether-lib'
import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface DetailFueltankChartData {
  date: string
  reward?: bigint
  fueltank?: bigint
}
export interface DetailFueltankChartsProps {
  rewards?: DetailFueltankChartData[]
  threshold?: number
}

export function DetailFueltankCharts(props: DetailFueltankChartsProps) {
  const data = useMemo(
    () => {
      const data = props.rewards?.map(
        (reward, index) => {
          return {
            ...reward,
            reward: props.rewards?.slice(0, index + 1).reduce((acc, curr) => acc + (curr.reward ? +formatEther(curr.reward, { delimiters: false }) : 0), 0),
            fueltank: +formatEther(reward.fueltank, { delimiters: false }),
          }
        },
      ) || []
      data[data.length - 1].reward ??= 0
      data[data.length - 1].fueltank ??= 0
      return data
    },
    [props.rewards],
  )
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ left: 18, right: -10 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a3ffcb" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#a3ffcb" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#70ADF8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#70ADF8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          fontSize="12"
          tickLine={false}
          label={{
            position: 'insideBottomRight',
            offset: -10,
          }}
        />

        <YAxis
          orientation="right"
          fontSize="12"
          width={70}
          tickFormatter={value => value > 0 ? `${value} MXC` : ''}
          tickLine={false}
          axisLine={{ stroke: 'rgba(0,0,0,0.5)' }}
          label={{
            angle: 90,
            position: 'insideRight',
          }}
          domain={[(props.threshold || 0), (max: number) => Math.max(max, props.threshold || 0) * 1.2]}
        />

        <Tooltip
          formatter={(value, name) => {
            if (name === 'Fueltank')
              return [`${value} MXC`, 'Fueltank']
            return [`${value} MXC`, 'Revenue']
          }}
        />
        <Area
          type="natural"
          dataKey="fueltank"
          name="Fueltank"
          stroke="#17c964"
          fillOpacity={1}
          fill="url(#colorUv)"
          activeDot={false}
        />

        <Area
          type="natural"
          dataKey="reward"
          name="Revenue"
          stroke="#70ADF8"
          fill="url(#colorRevenue)"
          fillOpacity={0.2}
          strokeWidth={1}
          strokeOpacity={0.5}
          activeDot={false}
        />

        <ReferenceLine
          y={props.threshold}
          stroke="#e74c3c"
          strokeDasharray="3 3"
          label={{
            position: 'insideBottomLeft',
            fill: '#e74c3c',
            fontSize: 14,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
