import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOLockVaultV7Module = buildModule('IHOLockVaultV7', (m) => {
  const implement = m.contract('IHOLockVaultV7', [], { id: 'IHOLockVaultV7Implement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [m.getAccount(1)])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOLockVaultV7Proxy' })

  const market = m.contractAt('IHOLockVaultV7', proxy, { id: 'IHOLockVaultV7' })

  return { market, proxy }
})

export default IHOLockVaultV7Module
