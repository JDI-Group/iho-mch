import type { Image as ImageType } from '@/apis/index.type'
import type { PropsWithDetailedHTML } from '@hairy/react-lib'
import { Image } from '@heroui/image'
import { Image as AntImage } from 'antd'

export interface ProductImagesProps extends PropsWithDetailedHTML {
  name?: string
  images?: ImageType[]
}

export function ProductImages({ name, images, className }: ProductImagesProps) {
  const [current, setImage] = useState<ImageType | null>(images?.[0] || null)
  const [visible, setVisible] = useState(false)
  return (
    <>
      <h1 className={title({ size: 'sm', className: ['md:hidden mb-4', className] })}>
        {name}
      </h1>
      <AntImage.PreviewGroup
        items={[current?.src as string]}
        preview={{
          onVisibleChange: value => setVisible(value),
          src: current?.src,
          visible,
        }}
      />
      <Lens>
        <div className="relative aspect-square w-full h-full overflow-hidden">
          <div
            className="w-full h-full border border-default-50"
            onClick={() => setVisible(true)}
          >
            <Image
              classNames={{ wrapper: 'h-full' }}
              className="w-full h-full object-cover z-0 cursor-none"
              width="100%"
              height="100%"
              src={current?.src}
            />
          </div>
        </div>
      </Lens>

      <div className="flex gap-2">
        {images?.map(image => (
          <div className="relative rounded-md overflow-hidden" key={image.id}>
            <Image
              className="p-0 object-cover"
              onClick={() => setImage(image)}
              src={image.src}
              width={100}
              height={100}
              alt="Card background"
            />
            <div
              className={clsx(
                'absolute inset-0 cursor-pointer',
                'flex justify-center items-center',
                'bg-black bg-opacity-80 transition-opacity z-10',
                current?.src !== image?.src ? 'opacity-80' : 'opacity-0',
              )}
              onClick={() => setImage(image)}
            >
              <MaterialSymbolsLightEyeTrackingRounded className="text-default-500" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
