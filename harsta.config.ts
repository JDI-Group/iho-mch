import type { Deploy, HarstaRuntimeEnvironment } from 'harsta'
import { Wallet } from 'ethers'
import { defineConfig } from 'harsta'

const deploy: Deploy = {
  accounts: [
    process.env.DEPLOYER_PRIVATE_KEY || Wallet.createRandom().privateKey,
    process.env.VERIFIER_PRIVATE_KEY || Wallet.createRandom().privateKey,
  ],
  saveDeployments: true,
  allowUnlimitedContractSize: true,
  gas: 'auto',
  gasPrice: 'auto',
}

const config = defineConfig({
  solidity: {
    settings: { evmVersion: 'shanghai' },
    version: '0.8.24',
  },
  networks: {
    geneva: {
      name: 'Moonchain Testnet',
      rpc: 'https://geneva-rpc.moonchain.com',
      testnet: true,
      id: 5167004,
      icon: 'https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg',
      currency: { decimals: 18, name: 'MXC Token', symbol: 'MXC' },
      explorer: {
        name: 'etherscan',
        url: 'https://geneva-explorer.moonchain.com',
      },
      deploy,
    },
    moonchain: {
      name: 'Moonchain',
      rpc: 'https://rpc.mxc.com',
      id: 18686,
      icon: 'https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg',
      currency: { decimals: 18, name: 'MXC Token', symbol: 'MXC' },
      explorer: {
        name: 'etherscan',
        url: 'https://explorer.moonchain.com',
      },
      deploy,
    },
  },
  deployments: {
    // IHO_Legacy: { kind: 'uups', args },
    IHO: { kind: 'uups', args },
  },
})

async function args({ getNamedAccount, getUnnamedAccount }: HarstaRuntimeEnvironment) {
  return [
    await getNamedAccount('owner') || await getUnnamedAccount(),
    await getNamedAccount('verifier') || await getUnnamedAccount(),
  ]
}

export default config
