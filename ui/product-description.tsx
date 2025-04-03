import { removeInnerHTMLAttributes } from '@/utils'
import { formatEther } from '@hairy/ether-lib'
import { Progress } from '@heroui/progress'
import { useOverlayInject } from '@overlastic/react'

export interface ProductDescriptionProps {
  description?: string
  orders?: number
  target?: number
  price?: string
  limit?: number
  name?: string
}
export function ProductDescription(props: ProductDescriptionProps) {
  const openProductDetailDialog = useOverlayInject(ProductDetailDialog)
  const html = removeInnerHTMLAttributes(props.description || '', 'class')
  const { orders = 0, target = 0 } = props
  return (
    <>
      <h1 className={title({ size: 'sm', className: 'hidden md:inline-block mb-4' })}>
        {props.name}
      </h1>
      <p className="mb-2 bg-tag bg-clip-text text-transparent uppercase font-bold">
        Virtual Reality Reimagined
      </p>
      <p className="mb-4">
        <span>Get it</span>
        <span className="font-bold"> FREE </span>
        <span>
          <span>by staking</span>
          <span className="font-bold"> {formatEther(props?.price, { separator: true })} </span>
          <span>Moonchain Tokens</span>
        </span>
      </p>
      <div className="flex-1 min-h-40 relative mb-4 bg-default-100 bg-opacity-40 rounded-lg overflow-hidden">
        <div
          className={clsx(
            'absolute z-10 inset-0 opacity-0 bg-black bg-opacity-45 dark:bg-opacity-70 cursor-pointer',
            'hover:opacity-100 transition-all duration-300 ease-in-out',
            'flex items-center justify-center gap-2 text-white dark:text-default-600',
          )}
          onClick={() => openProductDetailDialog(props)}
        >
          <div>Read More</div>
          <ScreenFullIcon width={18} height={18} />
        </div>
        <div className="absolute inset-0 overflow-hidden m-4">
          <div
            className="text-sm space-y-2 flex-1 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <div>Delivery Progress</div>
      <div className="flex items-center gap-2">
        <Progress className="flex-1" maxValue={target} value={orders} />
        <CarIcon size={32} />
      </div>

      <div className="-mt-2 mb-8 text-default-500 text-sm">
        {target - orders} more orders needed for dispatch
      </div>
      <div className="mb-8 text-default-500 text-sm">
        *Limit: {props.limit} item per wallet
      </div>
    </>
  )
}
