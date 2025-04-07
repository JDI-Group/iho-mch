import { formatEther } from '@hairy/ether-lib'
import { provider, signer } from '@harsta/client'
import { addToast } from '@heroui/toast'

export async function verifyInsufficientFunds(value: string) {
  const address = await signer.getAddress()
  const balance = await provider.getBalance(address)
  if (BigInt(value) > balance) {
    addToast({
      description: `Insufficient funds, Need ${formatEther(value)} MXC`,
      color: 'danger',
    })
    throw new Error('Insufficient funds')
  }
}
