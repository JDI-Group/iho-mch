import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'
import IHOLockVaultV2Module from './IHOLockVaultV2'

const IHOLockVaultV2_1Module = buildModule('IHOLockVaultV2_1', (m) => {
  const module = m.useModule(IHOLockVaultV2Module)
  const implement = m.contract('IHOLockVaultV2_1', [], { id: 'IHOLockVaultV2_1Implement' })

  m.call(module.market, 'upgradeToAndCall', [implement, '0x'], { from: m.getAccount(0) })

  const market = m.contractAt('IHOLockVaultV2_1', module.market, { id: 'IHOLockVaultV2_1' })

  return { market, proxy: module.proxy }
})

export default IHOLockVaultV2_1Module
