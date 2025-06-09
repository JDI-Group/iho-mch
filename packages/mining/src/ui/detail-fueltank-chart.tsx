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

const fuelData = [
  { time: '10/01', fuel: 1200, revenue: 2400 },
  { time: '10/02', fuel: 3000, revenue: 5200 },
  { time: '10/03', fuel: 2000, revenue: 4200 },
  { time: '10/04', fuel: 2780, revenue: 4900 },
  { time: '10/05', fuel: 1890, revenue: 3800 },
  { time: '10/06', fuel: 2390, revenue: 4700 },
  { time: '10/07', fuel: 1800, revenue: 3500 },
]

export function DetailFueltankChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={fuelData}
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
          dataKey="time"
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
        />

        <Tooltip
          formatter={(value, name) => {
            if (name === 'Fuel')
              return [`${value} MXC`, 'Fuel']
            return [`${value} MXC`, 'Revenue']
          }}
        />
        <Area
          type="natural"
          dataKey="fuel"
          name="Fuel"
          stroke="#17c964"
          fillOpacity={1}
          fill="url(#colorUv)"
          activeDot={false}
        />

        <Area
          type="natural"
          dataKey="revenue"
          name="Revenue"
          stroke="#70ADF8"
          fill="url(#colorRevenue)"
          fillOpacity={0.2}
          strokeWidth={1}
          strokeOpacity={0.5}
          activeDot={false}
        />

        <ReferenceLine
          y={1500}
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
