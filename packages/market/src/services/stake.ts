import type { OrderDataDto } from '@/apis/index.type'
import type { TransactionReceipt } from 'ethers'
import { wait } from '@hairy/ether-lib'
import { addToast } from '@heroui/toast'

export async function helperStake(params: { order: number }): Promise<TransactionReceipt | undefined | null>
export async function helperStake(params: { product: number, variation?: number }): Promise<TransactionReceipt | undefined | null>
export async function helperStake(params: { order: number } | { product: number, variation?: number }) {
  const { order, product, variation } = params as { order?: number, product?: number, variation?: number }

  if (!store.config.$getters.isLasted) {
    addToast({ description: 'Coming soon', color: 'danger' })
    return
  }

  const iho = getIhoLockVaultV1({
    address: Reflect.get(chain.contracts, `IHOLockVaultV${process.env.NEXT_PUBLIC_MARKET_BATCH}`)?.address,
    runner: wallet,
  })

  let detail: OrderDataDto | null = null

  if (product)
    detail = await postOrder({ variation, product }, undefined, undefined, { skipMessage: true } as any)

  if (detail) {
    const filter = iho.filters.StakeConfirmed(undefined, undefined, detail.order)
    const events = await iho.queryFilter(filter)
    if (events.length > 0) {
      addToast({ description: 'Please wait for the order index to continue', color: 'danger' })
      return
    }
  }

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
