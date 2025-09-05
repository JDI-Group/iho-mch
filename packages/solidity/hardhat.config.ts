/// <reference types="etherlib-generator/hardhat-network" />

import type { HardhatUserConfig } from 'hardhat/types/config'
import hardhatIgnitionViewPlugin from '@nomicfoundation/hardhat-ignition-viem'
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem'
import hardhatVerifyPlugin from '@nomicfoundation/hardhat-verify'
import { generatePrivateKey } from 'viem/accounts'

const accounts = [
  process.env.DEPLOYER_PRIVATE_KEY || generatePrivateKey(),
  process.env.VERIFIER_PRIVATE_KEY || generatePrivateKey(),
]

const config = {
  plugins: [
    hardhatIgnitionViewPlugin,
    hardhatToolboxViemPlugin,
    hardhatVerifyPlugin,
  ],
  verify: {
    blockscout: { enabled: true },
  },
  solidity: {
    profiles: {
      default: {
        settings: {
          optimizer: { enabled: true, runs: 50 },
        },
        version: '0.8.28',
      },
      production: {
        settings: {
          optimizer: { enabled: true, runs: 200 },
          evmVersion: 'shanghai',
        },
        version: '0.8.28',
      },
    },
    dependenciesToCompile: ['@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol'],
  },
  chainDescriptors: {},
  networks: {
    moonchainHudson: {
      name: 'Moonchain Hudson',
      currency: { name: 'MCH', symbol: 'MCH', decimals: 18 },
      explorer: { name: 'etherscan', url: 'https://hudson-explorer.mchain.ai' },
      url: 'https://hudson-rpc.mchain.ai',
      type: 'http',
      chainId: 177888,
      chainType: 'l1',
      accounts,
    },
    moonchain: {
      name: 'Moonchain',
      currency: { name: 'MCH', symbol: 'MCH', decimals: 18 },
      explorer: { name: 'etherscan', url: 'https://explorer.mchain.ai' },
      url: 'https://rpc.mchain.ai',
      type: 'http',
      chainId: 0,
      chainType: 'l1',
      accounts,
    }
  },
} as const satisfies HardhatUserConfig

export default config

// pnpm hardhat verify blockscout 0x3D19769221Eb1D4c749c3A9CD04702e2ce4DF2F2 --contract contracts/IHOLockVaultV1.sol:IHOLockVaultV1 --network moonchain --build-profile production

// pnpm hardhat verify blockscout 0x352B0273B9e08CB169b3301f440d387F9810CA5D --contract contracts/IHOLockVaultV1.sol:IHOLockVaultV1 --network moonchain --build-profile production

// pnpm hardhat verify blockscout 0xee58Fb14F1561Ee326aCD96278F75fD5CFdAFB1A --network moonchainGeneva --build-profile production

// pnpm hardhat verify blockscout 0x06aF307F0694d2335Ed2fC5e30e2C5626B2332e5 --network moonchain --build-profile production
