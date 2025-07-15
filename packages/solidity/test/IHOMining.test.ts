import type { Account, Address, Chain, Hash, Transport, WalletClient } from 'viem'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { integer, randomNumber } from '@hairy/utils'
import { network } from 'hardhat'
import { nanoid } from 'nanoid'
import { encodeAbiParameters, encodeFunctionData, encodePacked, getAddress, keccak256, zeroAddress } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import IHOMiningModule from '../ignition/modules/IHOMining'
/**
 * Load test environment
 * Returns deployed contracts and test accounts
 */
async function loadFixture() {
  const { ignition, viem } = await network.connect()
  const { mining, fuel } = await ignition.deploy(IHOMiningModule)
  const client = await viem.getPublicClient()
  const owner = await viem.getWalletClients().then(clients => clients[0])
  const verifier = await viem.getWalletClients().then(clients => clients[1])
  owner.account.address = getAddress(owner.account.address)
  verifier.account.address = getAddress(verifier.account.address)
  return {
    client,
    ignition,
    viem,
    mining,
    fuel,
    owner,
    verifier,
  }
}
/**
 * Calculate keccak256 hash of rewards coins array
 * @param coins Array of token and amount pairs
 * @returns Hash of encoded coins data
 */
function solidityPackedCoinsKeccak256(coins: { token: Address, amount: bigint }[]) {
  const rewardsEncoded = encodeAbiParameters(
    [{
      type: 'tuple[]',
      components: [
        { type: 'address', name: 'token' },
        { type: 'uint256', name: 'amount' },
      ],
    }],
    [coins],
  )
  return keccak256(rewardsEncoded)
}
/**
 * Calculate keccak256 hash for claim signature verification
 * @param claimId Unique identifier for the claim
 * @param account Account identifier
 * @param rewardsHash Hash of rewards data
 * @returns Hash for signature verification
 */
function solidityPackedClaimSignatureKeccak256(
  claimId: string,
  account: Address,
  rewardsHash: Hash,
) {
  const packed = encodePacked(
    ['string', 'address', 'bytes32'],
    [claimId, account, rewardsHash],
  )
  // Hash the packed message
  return keccak256(packed)
}

/**
 * Calculate keccak256 hash for device registration signature
 * @param owner Owner's address
 * @param name Device name
 * @param mac Device MAC address as bytes
 * @returns Hash for registration signature verification
 */
function solidityPackedRegisterSignatureKeccak256(
  owner: Address,
  name: string,
  mac: string,
  product: number,
  order: number,
) {
  const packed = encodePacked(
    ['address', 'string', 'string', 'uint24', 'uint24'],
    [owner, name, mac, product, order],
  )
  return keccak256(packed)
}

export interface RegisterParameters {
  owner: WalletClient<Transport, Chain, Account>
  verifier: WalletClient<Transport, Chain, Account>
}

export interface RegisterOverrides {
  product?: number
  order?: number
  name?: string
  mac?: string
}

async function randomRegisterArgs({ owner, verifier }: RegisterParameters, overrides?: RegisterOverrides) {
  const name = overrides?.name ?? nanoid(5)
  const mac = overrides?.mac ?? nanoid(8)
  const product = overrides?.product ?? +integer(randomNumber(0, 1000000))
  const order = overrides?.order ?? +integer(randomNumber(0, 1000000))

  const raw = solidityPackedRegisterSignatureKeccak256(owner.account.address, name, mac, product, order)
  const signature = await verifier.signMessage({ message: { raw } })
  // eslint-disable-next-line style/array-bracket-spacing
  const args = [ name, mac, product, order, signature ] as const
  const objs = { name, mac, product, order, signature }

  return Object.assign(args, objs)
}

describe('iHOMining', async () => {
  // Test contract deployment and initialization
  it('should be able to deploy iho mining module', async () => {
    const { mining, owner, verifier } = await loadFixture()

    assert.equal(await mining.read.owner(), getAddress(owner.account.address))
    assert.equal(await mining.read.verifier(), getAddress(verifier.account.address))
  })

  // Test device registration and token information retrieval
  it('should be able register and get info', async () => {
    const { mining, owner, verifier } = await loadFixture()
    const registerArgs = await randomRegisterArgs({ owner, verifier })

    const emptyAddress = await mining.read.accountOfDevice([registerArgs.mac])
    assert.equal(emptyAddress, zeroAddress, 'Account should not exist before registration')

    await mining.write.register(registerArgs as never)

    const { tokenContract, tokenId } = await mining.read.tokenOfDevice([registerArgs.mac])

    assert.equal(tokenContract, mining.address)
    assert.equal(await mining.read.ownerOf([tokenId]), owner.account.address)

    const device = await mining.read.deviceOfToken([tokenContract, tokenId])
    const account = await mining.read.accountOfDevice([registerArgs.mac])

    assert.notEqual(account, zeroAddress, 'Account should exist after registration')
    assert.equal(device.name, registerArgs.name)
    assert.deepEqual(device.mac, registerArgs.mac)
  })

  // Test sending ETH to ERC6551 account and executing transactions
  it('should be able to send erc6551 account ETH', async () => {
    const { mining, viem, client, owner, verifier } = await loadFixture()
    const registerArgs = await randomRegisterArgs({ owner, verifier })

    await mining.write.register(registerArgs as never)

    const address = await mining.read.accountOfDevice([registerArgs.mac])
    const account = await viem.getContractAt('ERC6551Account', address)

    await owner.sendTransaction({ to: address, value: 100n })

    assert.equal(await client.getBalance({ address }), 100n)

    const recipient = privateKeyToAccount(generatePrivateKey()).address

    await account.write.execute([
      recipient,
      100n,
      '0x',
    ])

    assert.equal(await client.getBalance({ address }), 0n)
    assert.equal(await client.getBalance({ address: recipient }), 100n)
  })

  // Test claiming ETH rewards with verification
  it('should be able claim 100 ETH', async () => {
    const CLAIM_ID = nanoid(8)
    const AMOUNT = 100n
    const rewards = [{ amount: AMOUNT, token: zeroAddress }]
    const { mining, viem, client, owner, verifier } = await loadFixture()
    const registerArgs = await randomRegisterArgs({ owner, verifier })

    await mining.write.register(registerArgs as never)
    await owner.sendTransaction({ to: mining.address, value: AMOUNT })

    const address = await mining.read.accountOfDevice([registerArgs.mac])
    const account = await viem.getContractAt('ERC6551Account', address)

    const rewardsHash = solidityPackedCoinsKeccak256(rewards)
    const messageByte = solidityPackedClaimSignatureKeccak256(CLAIM_ID, address, rewardsHash)

    // Sign the hash message
    const signature = await verifier.signMessage({ message: { raw: messageByte } })

    const encodeData = encodeFunctionData({
      abi: mining.abi,
      functionName: 'claim',
      args: [
        CLAIM_ID,
        address,
        rewards,
        signature,
        false,
        '',
      ],
    })

    await account.write.execute([mining.address, 0n, encodeData])
    const balance = await client.getBalance({ address })
    assert.equal(balance, AMOUNT)
  })

  // Test registering multiple devices for the same owner
  it('should be able to register multiple devices', async () => {
    const { mining, owner, verifier } = await loadFixture()

    const registerArgs1 = await randomRegisterArgs({ owner, verifier })
    const registerArgs2 = await randomRegisterArgs({ owner, verifier })

    await mining.write.register(registerArgs1 as never)
    await mining.write.register(registerArgs2 as never)

    const tm1 = await mining.read.tokenOfDevice([registerArgs1.mac])
    const tm2 = await mining.read.tokenOfDevice([registerArgs2.mac])

    assert.notEqual(tm1.tokenId, tm2.tokenId)
    assert.equal(await mining.read.ownerOf([tm1.tokenId]), owner.account.address)
    assert.equal(await mining.read.ownerOf([tm2.tokenId]), owner.account.address)
  })

  // Test claiming rewards with fuelling option enabled
  it('should be able claim with fuelling=true', async () => {
    const CLAIM_ID = nanoid(8)
    const AMOUNT = 100n
    const rewards = [{ amount: AMOUNT, token: zeroAddress }]
    const { client, mining, viem, owner, verifier, fuel } = await loadFixture()

    const registerArgs = await randomRegisterArgs({ owner, verifier })

    assert.equal(await mining.read.fuel(), fuel.address)

    await mining.write.register(registerArgs as never)
    await owner.sendTransaction({ to: mining.address, value: AMOUNT })

    const address = await mining.read.accountOfDevice([registerArgs.mac])
    const account = await viem.getContractAt('ERC6551Account', address)

    const rewardsHash = solidityPackedCoinsKeccak256(rewards)
    const messageByte = solidityPackedClaimSignatureKeccak256(CLAIM_ID, address, rewardsHash)
    const signature = await verifier.signMessage({ message: { raw: messageByte } })

    const encodeMiningClamiData = encodeFunctionData({
      abi: mining.abi,
      functionName: 'claim',
      args: [
        CLAIM_ID,
        address,
        rewards,
        signature,
        true,
        '',
      ],
    })

    await account.write.execute([
      mining.address,
      0n,
      encodeMiningClamiData,
    ])

    assert.equal(await fuel.read.balanceOf([address, zeroAddress]), AMOUNT)
    assert.equal(await client.getBalance({ address }), 0n)
  })

  // Test batch claiming rewards for multiple devices by owner
  it('should be able to batch claim rewards for multiple devices', async () => {
    // 设置测试参数
    const CLAIM_ID_1 = nanoid(8)
    const CLAIM_ID_2 = nanoid(8)
    const AMOUNT_1 = 100n
    const AMOUNT_2 = 200n
    const MEMO_1 = 'Reward for device 1'
    const MEMO_2 = 'Reward for device 2'

    // Prepare reward data
    const rewards1 = [{ amount: AMOUNT_1, token: zeroAddress }]
    const rewards2 = [{ amount: AMOUNT_2, token: zeroAddress }]

    const { client, mining, owner, verifier, fuel } = await loadFixture()

    const registerArgs1 = await randomRegisterArgs({ owner, verifier })
    const registerArgs2 = await randomRegisterArgs({ owner, verifier })

    await mining.write.register(registerArgs1 as never)
    await mining.write.register(registerArgs2 as never)

    const address1 = await mining.read.accountOfDevice([registerArgs1.mac])
    const address2 = await mining.read.accountOfDevice([registerArgs2.mac])

    await owner.sendTransaction({ to: mining.address, value: AMOUNT_1 + AMOUNT_2 })

    const batchRewards = [
      {
        id: CLAIM_ID_1,
        account: address1,
        rewards: rewards1,
        fuelling: false, // Directly send to account
        memo: MEMO_1,
      },
      {
        id: CLAIM_ID_2,
        account: address2,
        rewards: rewards2,
        fuelling: true, // Send to fuel contract
        memo: MEMO_2,
      },
    ]

    // Use the owner to call the claims method to collect rewards in bulk
    await mining.write.claims([batchRewards], { value: 0n })

    // Verification results
    // Device 1 should receive ETH directly
    assert.equal(await client.getBalance({ address: address1 }), AMOUNT_1)

    // The reward for device 2 should be deposited into the fuel contract
    assert.equal(await fuel.read.balanceOf([address2, zeroAddress]), AMOUNT_2)
    assert.equal(await client.getBalance({ address: address2 }), 0n)
  })
})
