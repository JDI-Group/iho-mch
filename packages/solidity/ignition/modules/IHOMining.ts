import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'
import erc6551Module from './ERC6551'
import IHOFuelModule from './IHOFuel'

const IHOMiningModule = buildModule('IHOMining', (m) => {
  const { accountImplement, accountRegistry } = m.useModule(erc6551Module)
  const { fuel } = m.useModule(IHOFuelModule)
  const implement = m.contract('IHOMining')

  const data = m.encodeFunctionCall(implement, 'initialize', [
    fuel,
    accountRegistry,
    accountImplement,
    m.getAccount(1),
  ])

  const proxy = m.contract('ERC1967Proxy', [implement, data])
  const mining = m.contractAt('IHOMining', proxy, { id: 'IHOMiningProxy' })
  return { mining, accountRegistry, accountImplement, fuel }
})

export default IHOMiningModule

// pnpm hardhat ignition deploy --network localhost ignition/modules/IHOMining.ts
