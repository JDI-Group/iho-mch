import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOFuelModule = buildModule('IHOFuel', (m) => {
  const implement = m.contract('IHOFuel', [], { id: 'IHOFuelImplement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOFuelProxy' })
  const fuel = m.contractAt('IHOFuel', proxy, { id: 'IHOFuel' })
  return { fuel }
})

export default IHOFuelModule

// pnpm hardhat ignition deploy --network localhost ignition/modules/IHOMining.ts
