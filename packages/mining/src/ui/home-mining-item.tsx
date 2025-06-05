import type { PropsWithDetailedHTML } from '@hairy/react-lib'
import { Image } from '@/components/image'
import { Card, CardFooter } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'

export interface HomeMiningItemProps extends PropsWithDetailedHTML {
  status?: 'active' | 'inactive'
  src?: string
  name: string
  id: string
}

export function HomeMiningItem({
  id,
  name,
  src,
  status = 'active',
  ...props
}: HomeMiningItemProps) {
  const router = useRouter()
  return (
    <div className={clsx('flex flex-col gap-2', props.className)} onClick={() => { router.push('/detail') }}>
      <Card isFooterBlurred className="border-none" radius="lg">
        <Image
          alt="Woman listing to music"
          className="object-cover"
          height={100}
          src={src}
          width={100}
          fallback={(
            <div className="w-[100px] h-[100px] flex items-center justify-center bg-black bg-opacity-25">
              <Icon fontSize="28" className="text-default-500 mb-4" icon="fluent:device-eq-16-filled" />
            </div>
          )}
        />
        <CardFooter className=" before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 text-tiny text-white truncate px-0">
          <div className="flex justify-between items-center w-full px-2">
            <span className="w-full truncate">ID.{id}</span>
            <div className={clsx('w-2 h-2 rounded-full', status === 'active' ? 'bg-green-500' : 'bg-red-500')} />
          </div>
        </CardFooter>
      </Card>
      <div className="flex justify-center items-center gap-2 text-tiny px-1">
        {name}
      </div>
    </div>
  )
}
