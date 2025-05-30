/// <reference types="etherlib-generator/hardhat-network" />

import hardhatIgnitionViewPlugin from '@nomicfoundation/hardhat-ignition-viem'
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem'
import { HardhatUserConfig } from 'hardhat/types/config'
import { generatePrivateKey } from 'viem/accounts'

const config = {
  plugins: [
    hardhatIgnitionViewPlugin,
    hardhatToolboxViemPlugin,
  ],
  solidity: {
    profiles: {
      default: { version: '0.8.28' },
      production: {
        settings: {
          evmVersion: 'shanghai',
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
        version: '0.8.28',
      },
    },
    remappings: ['forge-std/=npm/forge-std@1.9.4/src/'],
  },
  networks: {
    moonchainGeneva: {
      name: 'Moonchain Geneva',
      currency: { decimals: 18, name: 'MXC Token', symbol: 'MXC' },
      explorer: { name: 'etherscan', url: 'https://geneva-explorer.moonchain.com' },
      icon: 'https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg',
      url: 'https://geneva-rpc.moonchain.com',
      chainId: 5167004,
      type: 'http',
      chainType: 'l1',
      testnet: true,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY || generatePrivateKey(),
        process.env.VERIFIER_PRIVATE_KEY || generatePrivateKey(),
      ],
    },
    moonchain: {
      name: 'Moonchain',
      currency: { decimals: 18, name: 'MXC Token', symbol: 'MXC' },
      explorer: { name: 'etherscan', url: 'https://explorer.moonchain.com' },
      icon: 'https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg',
      url: 'https://rpc.mxc.com',
      type: 'http',
      chainId: 18686,
      chainType: 'l1',
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY || generatePrivateKey(),
        process.env.VERIFIER_PRIVATE_KEY || generatePrivateKey(),
      ],
    },
  },
} as const satisfies HardhatUserConfig

export default config
