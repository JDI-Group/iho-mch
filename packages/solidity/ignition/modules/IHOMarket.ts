import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOMarketModule = buildModule('IHOMarket', (m) => {
  const implement = m.contract('IHOMarket', [], { id: 'IhoMarketImplement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [m.getAccount(1)])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOMarketProxy' })
  const market = m.contractAt('IHOMarket', proxy, { id: 'IHOMarket' })
  return { market }
})

export default IHOMarketModule

// pnpm hardhat ignition deploy --network localhost ignition/modules/IHOMarket.ts
