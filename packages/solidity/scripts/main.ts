import { network } from 'hardhat'
import IHOLockVaultV4Module from '../ignition/modules/IHOLockVaultV4'

async function main() {
  const { ignition } = await network.connect('moonchain')
  const { market } = await ignition.deploy(IHOLockVaultV4Module)

  const products = [
    22714n,
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
