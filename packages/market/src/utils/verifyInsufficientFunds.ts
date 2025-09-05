import { formatEther } from '@hairy/ether-lib'
import { addToast, closeAll } from '@heroui/toast'

export async function verifyInsufficientFunds(value: string) {
  const address = await wallet.getAddress()
  const balance = await client.getBalance(address)
  if (BigInt(value) > balance) {
    closeAll()
    addToast({
      description: `Insufficient funds, Need ${formatEther(value)} MCH`,
      color: 'danger',
    })
    throw new Error('Insufficient funds')
  }
}
