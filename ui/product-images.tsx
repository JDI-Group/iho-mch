import type { Image as ImageType } from '@/api/index.type'
import type { PropsWithDetailedHTML } from '@hairy/react-lib'
import { Image } from '@heroui/image'

export interface ProductImagesProps extends PropsWithDetailedHTML {
  name?: string
  images?: ImageType[]
}

export function ProductImages({ name, images, className }: ProductImagesProps) {
  return (
    <>
      <h1 className={title({ size: 'sm', className: ['md:hidden mb-4', className] })}>
        {name}
      </h1>
      <Image
        className="aspect-square border border-default-50 object-cover"
        width="100%"
        height="100%"
        src={images?.[0]?.src}
      />
      <div className="flex gap-2">
        {images?.map(image => (
          <Image
            key={image.id}
            className="p-0"
            src={image.src}
            width={100}
            height={100}
            alt="Card background"
          />
        ))}
      </div>
    </>
  )
}
