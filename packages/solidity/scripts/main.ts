import { network } from 'hardhat'
import IHOLockVaultV5Module from '../ignition/modules/IHOLockVaultV5'

async function main() {
  const { ignition } = await network.connect('moonchain')
  const { market } = await ignition.deploy(IHOLockVaultV5Module)

  const products = [
    23033n,
    22701n,
  ]

  for (const product of products) {
    await market.write.confirm([product])
    console.log(`Confirmed product $${product}`)
  }

  await market.write.finish()

  console.log('Finished confirming products')
}

main()
