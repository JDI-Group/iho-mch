/// <reference types="etherlib-generator/hardhat-network" />

import type { HardhatUserConfig } from 'hardhat/config'
import hardhatIgnitionViewPlugin from '@nomicfoundation/hardhat-ignition-viem'
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem'

const config: HardhatUserConfig = {

  plugins: [
    hardhatIgnitionViewPlugin,
    hardhatToolboxViemPlugin,
  ],
  solidity: {
    profiles: {
      default: { version: '0.8.28' },
      production: {
        settings: { optimizer: { enabled: true, runs: 200 } },
        version: '0.8.28',
      },
    },
    remappings: ['forge-std/=npm/forge-std@1.9.4/src/'],
  },
  networks: {
    hardhatMainnet: { type: 'edr', chainType: 'l1' },
    hardhatOptimism: { type: 'edr', chainType: 'optimism' },
    moonchainGeneva: {
      name: 'Moonchain Geneva',
      type: 'http',
      chainType: 'l1',
      url: 'https://geneva-rpc.moonchain.com',
      chainId: 5167004,
      testnet: true,
      icon: 'https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg',
      currency: { decimals: 18, name: 'MXC Token', symbol: 'MXC' },
      explorer: { name: 'etherscan', url: 'https://geneva-explorer.moonchain.com' },
    },
    moonchain: {
      name: 'Moonchain',
      type: 'http',
      chainType: 'l1',
      url: 'https://rpc.mxc.com',
      chainId: 18686,
      icon: 'https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg',
      currency: { decimals: 18, name: 'MXC Token', symbol: 'MXC' },
      explorer: { name: 'etherscan', url: 'https://explorer.moonchain.com' },
    },
  },
}

export default config
