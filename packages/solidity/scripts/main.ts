import { network } from 'hardhat'
import { getAbiItem } from 'viem'
import IHOLockVaultV2Module from '../ignition/modules/IHOLockVaultV2'

async function main() {
  const { ignition, viem } = await network.connect('moonchain')
  const { market } = await ignition.deploy(IHOLockVaultV2Module)
  const client = await viem.getPublicClient()

  const logs = await client.getLogs({
    event: getAbiItem({ abi: market.abi, name: 'ProjectCreated' }),
  })

  console.log(logs)
  // await market.write.confirm([22714n])
  // console.log('Confirmed product 22714')

  // await market.write.finish()
  // console.log('Finished confirming products')
}

main()
