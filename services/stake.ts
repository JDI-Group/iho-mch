import type { OrderDataDto } from '@/api/index.type'
import { wait } from '@hairy/ether-lib'
import { chain, contracts } from '@harsta/client'
import { addToast } from '@heroui/toast'

export async function stake(params: { order: number }): Promise<OrderDataDto>
export async function stake(params: { product: number, variation: number }): Promise<OrderDataDto>
export async function stake(params: { order: number } | { product: number, variation: number }) {
  const { order, product, variation } = params as { order?: number, product?: number, variation?: number }
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  const iho = contracts.IHO.resolve('signer', chain.addresses.IHO)
  let detail: OrderDataDto | null = null
  if (product && variation)
    detail = await postOrder({ variation, product })
  if (order)
    detail = await postOrderPaid({ order })

  if (!detail) {
    addToast({ title: 'Error', description: 'Invalid order or product', color: 'danger' })
    return
  }

  const response = iho.stake(
    detail.product,
    detail.order,
    detail.coins,
    detail.expire,
    detail.memo,
    detail.signature,
  )
  await wait(response)

  return detail
}
