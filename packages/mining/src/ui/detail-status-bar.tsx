import type { Miner } from '@/apis/index.type'
import { Image } from '@/components/image'
import { Else, If, Then } from '@hairy/react-lib'
import { cover } from '@hairy/utils'
import { Chip, Skeleton } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { zeroAddress } from 'viem'

dayjs.extend(duration)

export interface DetailStatusBarProps {
  miner?: Miner
  loading?: boolean
}

export function DetailStatusBar(props: DetailStatusBarProps) {
  const account = props.miner?.account || zeroAddress
  const registerDate = dayjs.unix(props.miner?.timestamp || 0)
  const online = dayjs.duration(dayjs().diff(registerDate))

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Image
          src={props.miner?.image}
          alt={props.miner?.name}
          className="object-cover"
          height={70}
          width={70}
          isLoading={props.loading}
          fallback={(
            <div className="w-[70px] rounded-lg h-[70px] flex items-center justify-center bg-black bg-opacity-25">
              <Icon fontSize="28" className="text-default-500" icon="fluent:device-eq-16-filled" />
            </div>
          )}
        />
        <div className="flex-1 flex flex-col justify-between py-[1px]">
          <If cond={!props.loading} else={<Skeleton className="h-[18px] rounded-lg" />}>
            <span className="text-lg leading-none">{props.miner?.name}</span>
          </If>
          <Chip
            size="sm"
            className="h-[18px] text-tiny bg-default-700 text-default-50"
            onClick={() => clipboardCopy('Account', account)}
          >
            <div className="flex items-center gap-1">
              <span>{cover(account, [4, 4, 4])}</span>
              <Icon icon="solar:copy-bold-duotone" />
            </div>
          </Chip>
          <div className="flex gap-1 min-h-[18px]">
            <If
              cond={!props.loading}
              else={(
                <>
                  <Skeleton className="h-[18px] w-10 rounded-lg" />
                  <Skeleton className="h-[18px] w-10 rounded-lg" />
                </>
              )}
            >
              <If cond={props.miner?.traits?.length !== 0}>
                <Then>
                  {props.miner?.traits?.map(trait => (
                    <Chip key={trait} size="sm" className="h-[18px] text-tiny">
                      {trait}
                    </Chip>
                  ))}
                </Then>
                <Else>
                  <Chip size="sm" className="h-[18px] text-tiny text-default-500">
                    No traits
                  </Chip>
                </Else>
              </If>
            </If>

          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex justify-end">
            <Chip className="p-0 border-0 h-6" color="success" variant="dot">
              Online
            </Chip>
          </div>
          <div className="flex items-center gap-1 mb-[2px] mr-2">
            <Icon className="text-sm" icon="solar:clock-circle-outline" />
            <div className="text-sm">{online.format('D[d]/H[h]/m[m]')}</div>
          </div>
        </div>
      </div>
      <div className="min-h-14">
        <If cond={!props.loading} else={<Skeleton className="h-4 w-1/2 rounded-lg" />}>
          <If cond={props.miner?.description}>
            <Then>
              {props.miner?.description}

            </Then>
            <Else>
              <div className="text-default-500">
                No description provided
              </div>
            </Else>
          </If>
        </If>
      </div>
    </>
  )
}
