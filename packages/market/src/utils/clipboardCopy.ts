import { addToast } from '@heroui/toast'

export async function clipboardCopy(name: string, value: string, description?: string) {
  await navigator.clipboard.writeText(value)
  addToast({
    title: `${name} copied to clipboard`,
    description,
    color: 'success',
  })
}
