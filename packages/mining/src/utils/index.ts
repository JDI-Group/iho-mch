import { addToast, Link } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { createElement } from 'react'

export async function clipboardCopy(name: string, value: string, description?: string) {
  await navigator.clipboard.writeText(value)
  addToast({
    title: `${name} copied to clipboard`,
    description,
    color: 'success',
  })
}

export function transactionConfirmedToast(hash: string) {
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
