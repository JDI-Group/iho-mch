import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const erc6551Module = buildModule('ERC6551Registry', (m) => {
  const accountImplement = m.contract('ERC6551Account')
  const accountRegistry = m.contract('ERC6551Registry')
  return { accountRegistry, accountImplement }
})

export default erc6551Module

// pnpm hardhat ignition deploy --network localhost ignition/modules/ERC6551Registry.ts
