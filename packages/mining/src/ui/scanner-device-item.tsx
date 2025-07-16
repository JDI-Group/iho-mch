import type { Device } from '@/apis/index.type'
import { Card, CardBody, Image } from '@heroui/react'

export interface ScannerDeviceItemProps {
  device: Omit<Device, 'order' | 'product' | 'owner' | 'mac'> & { order?: number }
  select?: boolean
}
export function ScannerDeviceItem(props: ScannerDeviceItemProps) {
  return (
    <Card radius="sm" className={clsx('shadow-none border', props.select && 'border-primary bg-primary-50 bg-opacity-50')}>
      <CardBody className="py-1.5 px-2 pr-2.5">
        <div className="flex gap-2">
          <Image className="h-8 rounded-md" src={props.device.images[0].src} />
          <span className="flex-1 flex items-center justify-end min-w-0 text-sm truncate">
            {props.device.order ? `#${props.device.order}` : props.device.name}
          </span>
        </div>
      </CardBody>
    </Card>
  )
}
