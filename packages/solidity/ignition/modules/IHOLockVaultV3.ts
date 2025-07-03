import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOLockVaultV3Module = buildModule('IHOLockVaultV3', (m) => {
  const implement = m.contract('IHOLockVaultV3', [], { id: 'IHOLockVaultV3Implement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [m.getAccount(1)])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOLockVaultV3Proxy' })

  const market = m.contractAt('IHOLockVaultV3', proxy, { id: 'IHOLockVaultV3' })

  return { market, proxy }
})

export default IHOLockVaultV3Module
