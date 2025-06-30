import type { OrderDataDto } from '@/apis/index.type'
import type { TransactionReceipt } from 'ethers'
import { wait } from '@hairy/ether-lib'
import { addToast } from '@heroui/toast'

export async function helperStake(params: { order: number }): Promise<TransactionReceipt | undefined | null>
export async function helperStake(params: { product: number, variation?: number }): Promise<TransactionReceipt | undefined | null>
export async function helperStake(params: { order: number } | { product: number, variation?: number }) {
  const { order, product, variation } = params as { order?: number, product?: number, variation?: number }

  const ihoContracts = {
    1: getIhoLockVaultV1,
    2: getIhoLockVaultV2,
  }

  const batch = process.env.NEXT_PUBLIC_MARKET_BATCH as unknown as keyof typeof ihoContracts
  const iho = ihoContracts[batch]({ runner: wallet })

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

  return await wait(transaction)
}
