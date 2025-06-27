import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'
import IHOMarketModule from './IHOMarket'

const IHOLockVaultV1Module = buildModule('IHOLockVaultV1', (m) => {
  const module = m.useModule(IHOMarketModule)
  const implement = m.contract('IHOLockVaultV1', [], { id: 'IHOLockVaultV1Implement' })

  m.call(module.market, 'upgradeToAndCall', [implement, '0x'], { from: m.getAccount(0) })

  const market = m.contractAt('IHOLockVaultV1', module.market, { id: 'IHOLockVaultV1' })

  return { market, proxy: module.proxy }
})

export default IHOLockVaultV1Module
