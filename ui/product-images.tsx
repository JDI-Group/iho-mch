import type { Image as ImageType } from '@/apis/index.typee'
import type { PropsWithDetailedHTML } from '@hairy/react-lib'
import { Image } from '@heroui/image'
import { Image as AntImage } from 'antd'
import { AnimatePresence } from 'framer-motion'

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
        items={images?.map(image => image.src)}
        preview={{
          visible,
          src: current?.src,
          onVisibleChange: value => setVisible(value),
        }}
      />
      <Lens>
        <div className="relative aspect-square w-full h-full overflow-hidden">
          <AnimatePresence>
            <motion.div
              className="w-full h-full border border-default-50"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { delay: 0.5 } }}
              exit={{ x: -300, opacity: 0 }}
              key={current?.src}
              onClick={() => setVisible(true)}
            >
              <Image
                classNames={{ wrapper: 'h-full' }}
                className="w-full h-full object-cover z-0 cursor-none"
                width="100%"
                height="100%"
                src={current?.src}
              />
            </motion.div>
          </AnimatePresence>
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
