import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'
import IHOMarketModule from './IHOMarket'

const IHOMarketV2Module = buildModule('IHOMarketV2', (m) => {
  const { market, proxy } = m.useModule(IHOMarketModule)
  const implementV2 = m.contract('IHOMarketV2', [], { id: 'IhoMarketImplementV2' })
  const proxyAdminOwner = m.getAccount(0)

  m.call(market, 'upgradeToAndCall', [implementV2, '0x'], { from: proxyAdminOwner })

  const marketV2 = m.contractAt('IHOMarketV2', market, { id: 'IHOMarketV2' })

  return { market: marketV2, proxy }
})

export default IHOMarketV2Module

// pnpm hardhat ignition deploy --network localhost ignition/modules/IHOMarket.ts
