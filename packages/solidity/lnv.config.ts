import fs from 'node:fs/promises'
import { defineConfig } from '@hairy/lnv'

const config = defineConfig({
  injects: {
    entries: ['vault'],
  },
  scripts: {
    deploy: {
      prompts: [
        {
          key: 'modulePath',
          message: 'Select the module you want to deploy',
          options: async () => {
            const files = await fs.readdir('./ignition/modules')
            return files.map(file => ({
              value: `./ignition/modules/${file}`,
              label: file.replace('.ts', ''),
            }))
          },
        },
        {
          key: 'network',
          message: 'Select the network to deploy to',
          options: [
            {
              value: 'hardhat',
              label: 'Hardhat',
              hint: 'localhost',
            },
            {
              value: 'moonchainGeneva',
              label: 'Moonchain Geneva',
              hint: 'geneva-rpc.moonchain.com',
            },
            {
              value: 'moonchain',
              label: 'Moonchain Mainnet',
              hint: 'rpc.moonchain.com',
            },
          ],
        },
      ],
      command: 'hardhat --build-profile production ignition deploy $modulePath --network $network && etherlib generate',
    },
    exec: {
      prompts: [
        {
          key: 'filepath',
          message: 'Select the module you want to deploy',
          options: async () => {
            const files = await fs.readdir('./scripts')
            return files.map(file => ({
              value: `./scripts/${file}`,
              label: `./scripts/${file}`,
            }))
          },
        },
        {
          key: 'network',
          message: 'Select the network to deploy to',
          options: [
            {
              value: 'hardhat',
              label: 'Hardhat',
              hint: 'localhost',
            },
            {
              value: 'moonchainGeneva',
              label: 'Moonchain Geneva',
              hint: 'geneva-rpc.moonchain.com',
            },
            {
              value: 'moonchain',
              label: 'Moonchain Mainnet',
              hint: 'rpc.moonchain.com',
            },
          ],
        },
      ],
      command: 'hardhat --build-profile production --network $network run $filepath',
    },
    test: {
      message: 'Please select the scope you want to test',
      options: [
        {
          value: 'hardhat test',
          label: 'Default',
          hint: 'Solidity and TypeScript tests',
        },
        {
          value: 'hardhat test node',
          label: 'Node.js',
          hint: 'TypesScript tests',
        },
        {
          value: 'hardhat test solidity',
          label: 'Solidity',
          hint: 'Solidity tests',
        },
      ],
    },
  },
})

export default config
