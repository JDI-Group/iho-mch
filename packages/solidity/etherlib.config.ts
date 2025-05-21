import { defineConfig } from 'etherlib-generator'
import { ethers, hardhat, wagmi } from 'etherlib-generator/plugins'
import { erc20Abi } from 'viem'

// This is a configuration file for the Ethereum Library Generator.
const config = defineConfig([
  {
    output: '../mining/src/generated',
    fragments: { ERC20: erc20Abi },
    plugins: [
      hardhat(),
      wagmi(),
    ],
  },
  {
    output: '../market/generated',
    fragments: { ERC20: erc20Abi },
    plugins: [
      hardhat(),
      ethers(),
    ],
  },
])

export default config
