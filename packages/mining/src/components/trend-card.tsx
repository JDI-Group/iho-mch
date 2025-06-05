'use client'

import type { CurveType } from 'recharts/types/shape/Curve'
import { If } from '@hairy/react-lib'
import { riposte } from '@hairy/utils'
import { Card } from '@heroui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

interface TrendCardProps {
  title: string
  value: string
  change: string
  symbol?: string
  changeText?: string
  changeType: 'positive' | 'neutral' | 'negative'
  areaData?: any[]
  areaType?: CurveType
  areaKey?: string
  extra?: React.ReactNode
}

export function TrendCard({
  title,
  value,
  symbol,
  change,
  changeText,
  changeType,
  areaData,
  areaType = 'natural',
  areaKey,
  extra,
}: TrendCardProps) {
  return (
    <Card className="border-none">
      <section className="flex justify-between">
        <div className="flex flex-col justify-between gap-y-2 p-4">
          <div className="flex flex-col gap-y-4">
            <div className="text-sm font-medium text-default-600">{title}</div>
            <div className="flex items-end font-semibold text-default-700">
              <span className="text-2xl mr-2">{value}</span>
              <div className="text-base">{symbol}</div>
            </div>
          </div>
          <div className={clsx(
            'mt-2 flex items-center gap-x-1 text-xs font-medium',
            {
              negative: 'text-danger',
              neutral: 'text-warning',
              positive: 'text-success',
            }[changeType],
          )}
          >
            {riposte(
              [changeType === 'positive', <Icon key="up" height={12} icon="solar:arrow-right-up-linear" width={12} />],
              [changeType === 'neutral', <Icon key="neutral" height={12} icon="solar:arrow-right-linear" width={12} />],
              [changeType === 'negative', <Icon key="down" height={12} icon="solar:arrow-right-down-linear" width={12} />],
            )}
            <span>{change}</span>
            <span className="text-default-400 dark:text-default-500"> {changeText}</span>
          </div>
        </div>
        <div className="mt-10 min-h-24 w-36 min-w-[140px] shrink-0">
          <If cond={areaKey}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type={areaType}
                  dataKey={areaKey!}
                  stroke="#8884d8"
                  fill="url(#colorUv)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </If>
        </div>
        {extra}

      </section>
    </Card>
  )
}
