import { network } from 'hardhat'
import IHOLockVaultV6Module from '../ignition/modules/IHOLockVaultV6'

async function main() {
  _confirm()
}

async function _setProjects() {
  const { ignition } = await network.connect('moonchain')
  const { market } = await ignition.deploy(IHOLockVaultV6Module)
  await market.write.setProject([23078n, 100n, 0n])
  await market.write.setProject([23075n, 100n, 0n])

  console.log('Set projects done')
}

async function _confirm() {
  const { ignition } = await network.connect('moonchain')
  const { market } = await ignition.deploy(IHOLockVaultV6Module)

  const products = [
    23147n,
    23150n,
  ]

  for (const product of products) {
    await market.write.confirm([product])
    console.log(`Confirmed product $${product}`)
  }

  await market.write.finish()

  console.log('Finished confirming products')
}

main()
