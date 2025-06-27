import { defineConfig } from 'etherlib-generator'
import { ethers, hardhat, wagmi } from 'etherlib-generator/plugins'
import { erc20Abi, zeroAddress } from 'viem'

// This is a configuration file for the Ethereum Library Generator.
const config = defineConfig([
  {
    output: '../mining/src/generated',
    fragments: { ERC20: erc20Abi },

    addresses: {
      IHOFueltank: { 18686: zeroAddress },
      IHOMining: { 18686: zeroAddress },
    },
    plugins: [
      hardhat(),
      wagmi(),
    ],
  },
  {
    output: '../market/src/generated',
    fragments: { ERC20: erc20Abi },
    plugins: [
      hardhat(),
      ethers(),
    ],
  },
])

export default config
