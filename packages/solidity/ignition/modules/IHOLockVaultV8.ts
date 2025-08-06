import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOLockVaultV8Module = buildModule('IHOLockVaultV8', (m) => {
  const implement = m.contract('IHOLockVaultV8', [], { id: 'IHOLockVaultV8Implement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [m.getAccount(1)])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOLockVaultV8Proxy' })

  const market = m.contractAt('IHOLockVaultV8', proxy, { id: 'IHOLockVaultV8' })

  return { market, proxy }
})

export default IHOLockVaultV8Module
