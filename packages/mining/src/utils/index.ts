import type { Hex } from 'viem'
import { addToast, closeAll, Link } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import dayjs from 'dayjs'
import { createElement } from 'react'

export async function clipboardCopy(name: string, value: string, description?: string) {
  await navigator.clipboard.writeText(value)
  addToast({
    title: `${name} copied to clipboard`,
    description,
    color: 'success',
  })
}

export async function transactionWaitingReceipt(hash: Hex) {
  const promise = client.waitForTransactionReceipt({ hash })
  addToast({
    title: 'Waiting for Confirm Transaction',
    description: createElement('span', { className: 'text-tiny' }, 'You can check the progress in the ', createElement(
      Link,
      {
        href: `${chain.blockExplorers.default.url}/tx/${hash}`,
        className: 'text-tiny inline-flex gap-1',
        target: '_blank',
      },
      'explorer',
      createElement(Icon, { className: 'text-xs', icon: 'solar:round-arrow-right-up-broken' }),
    )),
    promise,
  })

  const receipt = await promise

  closeAll()

  if (receipt.status !== 'success') {
    addToast({
      title: 'Transaction Failed',
      description: createElement('span', { className: 'text-tiny' }, 'An unknown error has occurred, please contact the administrator.'),
    })
    throw new Error('Transaction failed')
  }
}

export async function transactionConfirmedToast(hash: Hex) {
  addToast({
    title: 'Transaction Successful',
    description: (
      createElement('span', { className: 'text-tiny' }, 'Your transaction has been successfully sent and confirmed. ', createElement(Link, {
        href: `${chain.blockExplorers.default.url}/tx/${hash}`,
        className: 'text-tiny inline-flex gap-1',
      }, 'Click to view transaction details', createElement(Icon, { className: 'text-sm', icon: 'solar:round-arrow-right-up-broken' })))
    ),
  })
}
export function generate7dayData<T>(item: T): (T & { timestamp: number, date: string })[] {
  return [
    { timestamp: dayjs().subtract(6, 'day').unix(), date: dayjs().subtract(6, 'day').format('MM/DD'), ...item },
    { timestamp: dayjs().subtract(5, 'day').unix(), date: dayjs().subtract(5, 'day').format('MM/DD'), ...item },
    { timestamp: dayjs().subtract(4, 'day').unix(), date: dayjs().subtract(4, 'day').format('MM/DD'), ...item },
    { timestamp: dayjs().subtract(3, 'day').unix(), date: dayjs().subtract(3, 'day').format('MM/DD'), ...item },
    { timestamp: dayjs().subtract(2, 'day').unix(), date: dayjs().subtract(2, 'day').format('MM/DD'), ...item },
    { timestamp: dayjs().subtract(1, 'day').unix(), date: dayjs().subtract(1, 'day').format('MM/DD'), ...item },
    { timestamp: dayjs().unix(), date: dayjs().format('MM/DD'), ...item },
  ]
}
