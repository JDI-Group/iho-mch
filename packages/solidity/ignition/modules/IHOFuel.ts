import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const IHOFuelModule = buildModule('IHOFuel', (m) => {
  const implement = m.contract('IHOFuel')

  const data = m.encodeFunctionCall(implement, 'initialize', [])

  const proxy = m.contract('ERC1967Proxy', [implement, data])
  const fuel = m.contractAt('IHOFuel', proxy, { id: 'IHOFuelProxy' })
  return { fuel }
})

export default IHOFuelModule

// pnpm hardhat ignition deploy --network localhost ignition/modules/IHOMining.ts
