import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOFueltankModule = buildModule('IHOFueltank', (m) => {
  const implement = m.contract('IHOFueltank', [], { id: 'IHOFueltankImplement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOFueltankProxy' })
  const fuel = m.contractAt('IHOFueltank', proxy, { id: 'IHOFueltank' })
  return { fuel }
})

export default IHOFueltankModule

// pnpm hardhat ignition deploy --network localhost ignition/modules/IHOMining.ts
