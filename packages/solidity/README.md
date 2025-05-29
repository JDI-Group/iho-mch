## IHO Solidity Package

This package contains the Solidity contracts for the IHO project. It includes the core contracts that implement the IHO protocol, as well as any necessary libraries and utilities.

## Networks

The contracts are deployed on the following networks:

- **Hardhat Mainnet (hardhatMainnet)**
- **Moonchain Geneva (moonchainGeneva)**
- **Moonchain Mainnet (moonchain)**

## Environment Setup

Before continuing, please configure your deployment private key:

- DEPLOYER_PRIVATE_KEY
- VERIFIER_PRIVATE_KEY

## Ignitions

Contracts are deployed using Hardhat Ignition, the supported Ignition modules are:

- `ignition/modules/IHOMarket.ts`
- `ignition/modules/IHOMining.ts`
- `ignition/modules/IHOFuel.ts`

Use the following script for deployment:

```sh
pnpm hardhat --build-profile production ignition deploy <module-file> --network <alias>

## pnpm hardhat --build-profile production ignition deploy ignition/modules/IHOMarket.ts --network moonchainGeneva
## pnpm hardhat --build-profile production ignition deploy ignition/modules/IHOMining.ts --network moonchainGeneva
## pnpm hardhat --build-profile production ignition deploy ignition/modules/IHOFuel.ts --network moonchainGeneva
```
