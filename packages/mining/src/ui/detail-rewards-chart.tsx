import { arange } from '@hairy/utils'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  {
    name: '10/01',
    amt: 2210,
  },
  {
    name: '10/02',
    amt: 2210,
  },
  {
    name: '10/03',
    amt: 2290,
  },
  {
    name: '10/04',
    amt: 2000,
  },
  {
    name: '10/05',
    amt: 2181,
  },
  {
    name: '10/06',
    amt: 2500,
  },
  {
    name: '10/07',
    amt: 2100,
  },
]
export function DetailRewardChart() {
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart margin={{ left: 18, right: -20 }} data={data}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#70ADF8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#70ADF8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            tickLine={false}
            fontSize="12"
            dataKey="name"
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
            dataKey="amt"
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
