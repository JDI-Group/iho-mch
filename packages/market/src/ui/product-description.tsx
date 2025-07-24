import { useAsyncState } from '@hairy/react-lib'

export interface ProductDescriptionProps {
  description?: string
  product?: number
}

export function ProductDescription({ description, product }: ProductDescriptionProps) {
  const [{ value: _stats }] = useAsyncState(
    () => getStatsProduct({ product: product! }),
    [],
    { immediate: true },
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mt-6 mb-4">Product Description</h2>
      <div dangerouslySetInnerHTML={{ __html: description || '' }} />
    </div>
  )
}
