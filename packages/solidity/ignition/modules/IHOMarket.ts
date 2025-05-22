import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOMarket = buildModule('IHOMarket', (m) => {
  const implement = m.contract('IHOMarket')

  const data = m.encodeFunctionCall(implement, 'initialize', [
    m.getAccount(1),
  ])

  const proxy = m.contract('ERC1967Proxy', [implement, data])
  const market = m.contractAt('IHOMarket', proxy, { id: 'IHOMarketProxy' })
  return { market }
})

export default IHOMarket

// pnpm hardhat ignition deploy --network localhost ignition/modules/IHOMarket.ts
