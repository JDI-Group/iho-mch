import type { OrderDataDto } from '@/api/index.type'
import { wait } from '@/utils/wait'
import { contracts } from '@harsta/client'
import { addToast } from '@heroui/toast'

export async function helperStake(params: { order: number }): Promise<OrderDataDto>
export async function helperStake(params: { product: number, variation: number }): Promise<OrderDataDto>
export async function helperStake(params: { order: number } | { product: number, variation: number }) {
  const { order, product, variation } = params as { order?: number, product?: number, variation?: number }
  const iho = contracts.IHO.resolve('signer')
  let detail: OrderDataDto | null = null
  if (product && variation)
    detail = await postOrder({ variation, product })
  if (order)
    detail = await postOrderPay({ order })

  if (!detail) {
    addToast({ title: 'Error', description: 'Invalid order or product', color: 'danger' })
    return
  }

  const transaction = iho.stake(
    detail.product,
    detail.order,
    detail.coins,
    detail.expire,
    detail.memo,
    detail.signature,
    { value: detail.value },
  )

  await wait(transaction)

  return detail
}
