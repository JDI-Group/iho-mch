import type { OrderDataDto } from '@/apis/index.type'
import { wait } from '@hairy/ether-lib'
import { addToast } from '@heroui/toast'

export async function helperStake(params: { order: number }): Promise<OrderDataDto>
export async function helperStake(params: { product: number, variation?: number }): Promise<OrderDataDto>
export async function helperStake(params: { order: number } | { product: number, variation?: number }) {
  const { order, product, variation } = params as { order?: number, product?: number, variation?: number }
  const iho = getIhoMarket({ runner: wallet })
  let detail: OrderDataDto | null = null
  if (product)
    detail = await postOrder({ variation, product }, undefined, undefined, { skipMessage: true } as any)

  if (order) {
    detail = await postOrderPay({ order })
    await verifyInsufficientFunds(detail.value)
  }

  if (!detail) {
    addToast({ description: 'Invalid order or product', color: 'danger' })
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
