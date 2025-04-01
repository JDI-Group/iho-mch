import { defineConfig } from 'harsta'

const config = defineConfig({
  solidity: {
    settings: { evmVersion: 'shanghai' },
    version: '0.8.24',
  },
  networks: {
    geneva: {
      name: 'Moonchain',
      rpc: 'https://geneva-rpc.moonchain.com',
      testnet: true,
      id: 5167004,
      icon: 'https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg',
      currency: { decimals: 18, name: 'MXC Token', symbol: 'MXC' },
      explorer: {
        name: 'etherscan',
        url: 'https://geneva-explorer.moonchain.com',
      },
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
    },
  },
  deployments: {
    IHO_Legacy: {
      kind: 'uups',
      async args({ getNamedAccount, getUnnamedAccount }) {
        return [
          await getNamedAccount('owner') || await getUnnamedAccount(),
          await getNamedAccount('verifier') || await getUnnamedAccount(),
        ]
      },
    },
    IHO: {
      kind: 'uups',
      async args({ getNamedAccount, getUnnamedAccount }) {
        return [
          await getNamedAccount('owner') || await getUnnamedAccount(),
          await getNamedAccount('verifier') || await getUnnamedAccount(),
        ]
      },
    },
  },
})

export default config
