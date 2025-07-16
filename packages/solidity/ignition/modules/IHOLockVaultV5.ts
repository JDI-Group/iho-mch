import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOLockVaultV5Module = buildModule('IHOLockVaultV5', (m) => {
  const implement = m.contract('IHOLockVaultV5', [], { id: 'IHOLockVaultV5Implement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [m.getAccount(1)])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOLockVaultV5Proxy' })

  const market = m.contractAt('IHOLockVaultV5', proxy, { id: 'IHOLockVaultV5' })

  return { market, proxy }
})

export default IHOLockVaultV5Module
