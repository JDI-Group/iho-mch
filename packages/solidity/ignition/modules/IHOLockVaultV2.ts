import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOLockVaultV2Module = buildModule('IHOLockVaultV2', (m) => {
  const implement = m.contract('IHOLockVaultV2', [], { id: 'IHOLockVaultV2Implement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [m.getAccount(1)])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOLockVaultV2Proxy' })

  const market = m.contractAt('IHOLockVaultV2', proxy, { id: 'IHOLockVaultV2' })

  return { market, proxy }
})

export default IHOLockVaultV2Module
