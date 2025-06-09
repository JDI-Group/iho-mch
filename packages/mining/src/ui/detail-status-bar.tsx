import type { Miner } from '@/apis/index.type'
import { Image } from '@/components/image'
import { Chip } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'

export interface DetailStatusBarProps {
  miner?: Miner
  loading?: boolean
}

export function DetailStatusBar(props: DetailStatusBarProps) {
  return (
    <>
      <div className="flex gap-2 mb-4">
        <Image
          src="https://heroui.com/images/album-cover.png"
          alt="Woman listing to music"
          className="object-cover"
          height={70}
          isLoading={props.loading}
          width={70}
        />
        <div className="flex-1 flex flex-col">
          <span className="text-lg">Bluetooth app name</span>
          <div className="flex gap-1 mb-1">
            <Chip size="sm" className="h-[18px] text-tiny">Headset</Chip>
            <Chip size="sm" className="h-[18px] text-tiny">Virtual</Chip>
          </div>
          <Chip size="sm" className="h-[18px] text-tiny bg-default-700 text-default-50 px-2">
            <div className="flex items-center gap-1">
              <span>0xcEb9...cBDf</span>
              <Icon icon="solar:copy-bold-duotone" />
            </div>
          </Chip>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex justify-end">
            <Chip className="p-0 border-0" color="success" variant="dot">
              Online
            </Chip>
          </div>
          <div className="flex items-center gap-1 mb-[2px] mr-2">
            <Icon className="text-sm" icon="solar:clock-circle-outline" />
            <div className="text-sm">3h / 4min</div>
          </div>
        </div>
      </div>
      <span>
        It's day one of a healthier, smarter, better you. You're full of zest and good intentions. You woke up at 5am to run before work, you read a book in your lunchbreak.
      </span>
    </>
  )
}
