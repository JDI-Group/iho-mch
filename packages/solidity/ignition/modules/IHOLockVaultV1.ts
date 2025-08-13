import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOLockVaultV1Module = buildModule('IHOLockVaultV1', (m) => {
  const implement = m.contract('IHOLockVaultV1', [], { id: 'IHOLockVaultV1Implement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [m.getAccount(1)])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOLockVaultV1Proxy' })

  const market = m.contractAt('IHOLockVaultV1', proxy, { id: 'IHOLockVaultV1' })

  return { market, proxy }
})

export default IHOLockVaultV1Module
