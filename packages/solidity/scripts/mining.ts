/* eslint-disable unused-imports/no-unused-vars */
import { JsonRpcProvider as EthersClient, Contract as EthersContract, Wallet as EthersWallet, solidityPackedKeccak256, toBeArray } from 'ethers'
import { network } from 'hardhat'
import { nanoid } from 'nanoid'
import { encodePacked, getAddress, keccak256 } from 'viem'
import config from '../hardhat.config'
import IHOMiningModule from '../ignition/modules/IHOMining'

const { ignition, viem } = await network.connect({
  network: 'moonchainGeneva',
})

const { mining } = await ignition.deploy(IHOMiningModule)
const [owner, verifier] = await viem.getWalletClients()
const client = await viem.getPublicClient()

async function main() {
  // testMoonchainGenevaMiningRegistry() // through testing
  testMoonchainGenevaMiningRegistryByEthers() // test error
}

main()

async function testMoonchainGenevaMiningRegistry() {
  console.log('Start testing Moonchain Geneva Mining...')
  // check verifier is account 2
  if (await mining.read.verifier() === getAddress(verifier.account.address)) {
    console.log('Verifier is set correctly')
  }
  const device = nanoid(10)

  const packed = encodePacked(
    ['address', 'string'],
    [owner.account.address, device],
  )
  const signature = await verifier.signMessage({ message: { raw: keccak256(packed) } })
  console.log(`Device: ${device}, Signature: ${signature}`)
  const hash = await mining.write.register([device, signature])
  await client.waitForTransactionReceipt({ hash })
  console.log(`Device ${device} registered with hash: ${hash}`)
}

async function testMoonchainGenevaMiningRegistryByEthers() {
  console.log('Start testing Moonchain Geneva Mining with Ethers...')
  const client = new EthersClient(config.networks.moonchainGeneva.url)
  const owner = new EthersWallet(config.networks.moonchainGeneva.accounts[0], client)
  const verifier = new EthersWallet(config.networks.moonchainGeneva.accounts[1], client)
  const device = nanoid(10)

  const ethersMining = new EthersContract(mining.address, mining.abi, owner)

  const messageHash = solidityPackedKeccak256(
    ['address', 'string'],
    [owner.address, device],
  )
  const signature = await verifier.signMessage(toBeArray(messageHash))
  console.log(`Device: ${device}, Signature: ${signature}`)
  const transaction = await ethersMining.register(device, signature)
  await transaction.wait()
  console.log(`Device ${device} registered with hash: ${transaction.hash}`)
}
