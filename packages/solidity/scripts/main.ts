import { network } from 'hardhat'
import IHOLockVaultV1Module from '../ignition/modules/IHOLockVaultV1'

async function main() {
  const { ignition } = await network.connect('moonchain')
  const { market } = await ignition.deploy(IHOLockVaultV1Module)

  await market.write.confirm([22714n])
  console.log('Confirmed product 22714')

  // await market.write.finish()
  // console.log('Finished confirming products')
}

main()
