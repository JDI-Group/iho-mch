# Moonchain DApp Starter

A comprehensive toolkit for developing decentralized applications (DApps) based on Ethereum. It integrates wallet connection, smart contract interaction, and modern frontend development tools, allowing you to quickly start building Web3 applications.

## Technology Stack

- **Frontend Framework**: Next.js 15.2.4 + React 19.1.0
- **Development Language**: TypeScript
- **Styling Solution**: Tailwind CSS
- **Web3 Integration**:
  - wagmi 2.15.2 (Ethereum React Hooks library)
  - ethers 6.14.0 (Ethereum JavaScript library)
  - @rainbow-me/rainbowkit (Web3 wallet connection UI library)
- **Smart Contracts**:
  - Solidity 0.8.24+
  - OpenZeppelin Contracts 5.2.0
  - OpenZeppelin Upgradeable Contracts 5.2.0
- **Build Tools**:
  - pnpm (package manager)
  - harsta (compilation and deployment tool)
  - ESLint (code linting)

## Features

- 🔌 **Wallet Connection**: Simple and intuitive wallet connection experience using RainbowKit
- 📝 **Message Signing**: Demonstrates how to sign messages using the connected wallet
- 🔐 **Contract References**: Direct reference to contract code in the frontend based on harsta
- 🚀 **Upgradeable Contracts**: Support for both Transparent and UUPS proxy patterns
- 🧪 **Testing Framework**: Integrated testing with harsta and vitest
- 🌐 **Moonchain Support**: Pre-configured for Moonchain mainnet and testnet
- 🎨 **Modern UI**: Build beautiful user interfaces using HeroUI component library and Tailwind CSS
- 🔄 **Responsive Design**: Interfaces that adapt to various device sizes

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- pnpm 10.10.0 or higher

### Installation

```bash
# Clone repository
git clone <repository-url>
cd starter

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

Visit http://localhost:3000 to view the application.

### Build

```bash
# Build production version
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
starter/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   ├── config/              # Configuration files
│   │   ├── addresses.json   # Contract address configuration
│   │   ├── wagmi.ts         # Wagmi configuration
│   │   └── fragments/       # GraphQL fragments
│   ├── contracts/           # Smart contracts
│   │   ├── ERC20WithOwnable.sol       # Standard ERC20 contract
│   │   ├── ERC20WithTransparent.sol   # Transparent proxy upgradeable ERC20
│   │   └── ERC20WithUUPS.sol          # UUPS proxy upgradeable ERC20
│   ├── layouts/             # Page layout components
│   ├── pages/               # Next.js pages
│   │   ├── _app.tsx         # Application entry
│   │   ├── index.tsx        # Home page
│   │   └── api/             # API routes
│   ├── store/               # State management
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
└── test/                    # Test files
    └── erc20.test.ts        # ERC20 contract tests
```

## Smart Contracts

The project includes three types of ERC20 token contracts:

### Standard ERC20 Contract

```solidity
// ERC20WithOwnable.sol
contract ERC20WithOwnable is ERC20, Ownable {
  constructor(address _owner, string memory _name, string memory _symbol) ERC20(_name, _symbol) Ownable(msg.sender) {
    _mint(_owner, 40000000 * 10 ** 18);
  }

  function mint(address account, uint256 amount) public onlyOwner {
    _mint(account, amount);
  }
}
```

### Transparent Proxy Upgradeable ERC20

```solidity
// ERC20WithTransparent.sol
contract ERC20WithTransparent is ERC20Upgradeable, OwnableUpgradeable {
  constructor() { _disableInitializers(); }

  function initialize(address _owner, string memory _name, string memory _symbol) public initializer {
    __ERC20_init(_name, _symbol);
    __Ownable_init(msg.sender);
    _mint(_owner, 40000000 * 10 ** 18);
  }

  function mint(address account, uint256 amount) public onlyOwner {
    _mint(account, amount);
  }
}
```

### UUPS Proxy Upgradeable ERC20

```solidity
// ERC20WithUUPS.sol
contract ERC20WithUUPS is ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
  constructor() { _disableInitializers(); }
  function _authorizeUpgrade(address) internal override onlyOwner {}

  function initialize(address _owner, string memory _name, string memory _symbol) public initializer {
    __ERC20_init(_name, _symbol);
    __Ownable_init(msg.sender);
    _mint(_owner, 40000000 * 10 ** 18);
  }

  function mint(address account, uint256 amount) public onlyOwner {
    _mint(account, amount);
  }
}
```

## Development Guide

### Adding New Pages

Create new `.tsx` files in the `src/pages` directory. Next.js will automatically make them available as routes.

### Smart Contracts

1. Add or modify Solidity contracts in the `src/contracts` directory
2. Write test files in the `test` directory
3. Configure contract deployment in `harsta.config.ts`
4. Use `pnpm harsta deploy --network <network-alias>` to deploy contracts
5. Reference `@harsta/client` in pages to query or call contract methods

### Testing

```bash
# Run tests on local hardhat network
pnpm test:hardhat

# Run tests with fork of Moonchain testnet
pnpm test:fork:testnet

# Run tests with fork of Moonchain mainnet
pnpm test:fork:mainnet
```

### Deployment

```bash
# Deploy to local hardhat network
pnpm deploy:hardhat

# Deploy to Moonchain testnet (Geneva)
pnpm deploy:testnet

# Deploy to Moonchain mainnet
pnpm deploy:mainnet
```

### Verification

```bash
# Verify contract on Moonchain testnet
pnpm verify:testnet --target <contract-name>

# Verify contract on Moonchain mainnet
pnpm verify:mainnet --target <contract-name>
```

### Frontend Integration

Reference `@harsta/client` in pages to query or call contract methods:

```typescript
import { contracts } from '@harsta/client'

// Use standard contract
const erc20 = contracts.ERC20.resolve('signer')
await erc20.transfer(address, amount)

// Use transparent proxy contract
const transparentERC20 = contracts.ERC20WithTransparent.resolve('signer')
await transparentERC20.mint(address, amount)

// Use UUPS proxy contract
const uupsERC20 = contracts.ERC20WithUUPS.resolve('signer')
await uupsERC20.mint(address, amount)
```

### Style Customization

The project uses Tailwind CSS for styling. You can customize the theme in `tailwind.config.js`.

## License

[MIT](LICENSE)
