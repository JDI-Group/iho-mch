import { network } from 'hardhat'
import { getAbiItem } from 'viem'
import IHOLockVaultV1Module from '../ignition/modules/IHOLockVaultV1'

async function main() {
  const { ignition, viem } = await network.connect('moonchainGeneva')
  const client = await viem.getPublicClient()
  const { market } = await ignition.deploy(IHOLockVaultV1Module)

  const logs = await client.getLogs({
    fromBlock: 0n,
    address: market.address,
    event: getAbiItem({ abi: market.abi, name: 'ProjectConfirm' }),
  })

  // await market.write.confirm([22643n])
  // console.log('Confirmed product 22643')
  // await market.write.confirm([22649n])
  // console.log('Confirmed product 22649')
  // await market.write.confirm([22668n])
  // console.log('Confirmed product 22668')

  // await market.write.finish()
  // console.log('Finished confirming products')

  console.log(logs)
}

main()
