import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'
import erc6551Module from './ERC6551'

const IHOMiningModule = buildModule('IHOMining', (m) => {
  const { accountImplement, accountRegistry } = m.useModule(erc6551Module)
  const implement = m.contract('IHOMining', [], { id: 'IHOMMiningImplement' })

  const data = m.encodeFunctionCall(implement, 'initialize', [
    accountRegistry,
    accountImplement,
    m.getAccount(1),
  ])

  const proxy = m.contract('ERC1967Proxy', [implement, data], { id: 'IHOMiningProxy' })
  const mining = m.contractAt('IHOMining', proxy, { id: 'IHOMining' })
  return { mining, accountRegistry, accountImplement }
})

export default IHOMiningModule

// pnpm hardhat ignition deploy --network localhost ignition/modules/IHOMining.ts
