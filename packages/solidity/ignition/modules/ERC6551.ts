import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const erc6551Module = buildModule('ERC6551Registry', (m) => {
  const accountRegistry = m.contract('ERC6551Registry')
  const accountImplement = m.contract('ERC6551Account')
  return { accountRegistry, accountImplement }
})

export default erc6551Module

// pnpm hardhat ignition deploy --network localhost ignition/modules/ERC6551Registry.ts
