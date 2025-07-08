import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOLockVaultV4Module = buildModule('IHOLockVaultV4', (m) => {
  const implement = m.contract('IHOLockVaultV4', [], { id: 'IHOLockVaultV4Implement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [m.getAccount(1)])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOLockVaultV4Proxy' })

  const market = m.contractAt('IHOLockVaultV4', proxy, { id: 'IHOLockVaultV4' })

  return { market, proxy }
})

export default IHOLockVaultV4Module
