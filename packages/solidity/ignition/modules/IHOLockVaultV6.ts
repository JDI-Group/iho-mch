import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOLockVaultV6Module = buildModule('IHOLockVaultV6', (m) => {
  const implement = m.contract('IHOLockVaultV6', [], { id: 'IHOLockVaultV6Implement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [m.getAccount(1)])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOLockVaultV6Proxy' })

  const market = m.contractAt('IHOLockVaultV6', proxy, { id: 'IHOLockVaultV6' })

  return { market, proxy }
})

export default IHOLockVaultV6Module
