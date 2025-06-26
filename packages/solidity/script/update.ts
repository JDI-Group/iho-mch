import { network } from 'hardhat'
import IHOMarketV2Module from '../ignition/modules/IHOMarketV2'

async function main() {
  const { ignition } = await network.connect()

  const { market } = await ignition.deploy(IHOMarketV2Module)

  await market.write.updateProject([22713n, 300n, false])
  await market.write.updateProject([22714n, 100n, false])

  // eslint-disable-next-line no-console
  console.log('Market updated successfully')
}

main()
