import type { Address, Hash } from 'viem'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { network } from 'hardhat'
import { nanoid } from 'nanoid'
import { encodeAbiParameters, encodeFunctionData, getAddress, keccak256, zeroAddress } from 'viem'
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
 * @param device Device identifier
 * @param rewardsHash Hash of rewards data
 * @returns Hash for signature verification
 */
function solidityPackedClaimSignatureKeccak256(
  claimId: string,
  device: string,
  rewardsHash: Hash,
) {
  // Encode message using abi.encode format to match contract verification method
  const encoded = encodeAbiParameters(
    [
      { type: 'string', name: 'claimId' },
      { type: 'string', name: 'device' },
      { type: 'bytes32', name: 'rewardsHash' },
    ],
    [claimId, device, rewardsHash],
  )
  // Hash the encoded message
  return keccak256(encoded)
}

/**
 * Calculate keccak256 hash for device registration signature
 * @param owner Owner's address
 * @param device Device identifier
 * @returns Hash for registration signature verification
 */
function solidityPackedRegisterSignatureKeccak256(
  owner: Address,
  device: string,
) {
  const encoded = encodeAbiParameters(
    [
      { type: 'address', name: 'owner' },
      { type: 'string', name: 'device' },
    ],
    [owner, device],
  )
  return keccak256(encoded)
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
    const REGISTER_DEVICE_ID = nanoid(8)

    const { mining, owner, verifier } = await loadFixture()

    const registerMessageByte = solidityPackedRegisterSignatureKeccak256(
      owner.account.address,
      REGISTER_DEVICE_ID,
    )
    const registerSignature = await verifier.signMessage({ message: { raw: registerMessageByte } })

    await mining.write.register([REGISTER_DEVICE_ID, registerSignature])

    const { token, tokenId } = await mining.read.tokenOf([REGISTER_DEVICE_ID])

    assert.equal(token, mining.address)
    assert.equal(await mining.read.ownerOf([tokenId]), owner.account.address)

    const device = await mining.read.deviceOf([token, tokenId])

    assert.equal(device, REGISTER_DEVICE_ID)
  })

  // Test sending ETH to ERC6551 account and executing transactions
  it('should be able to send erc6551 account ETH', async () => {
    const REGISTER_DEVICE_ID = nanoid(8)
    const { mining, viem, client, owner, verifier } = await loadFixture()

    const registerMessageByte = solidityPackedRegisterSignatureKeccak256(
      owner.account.address,
      REGISTER_DEVICE_ID,
    )
    const registerSignature = await verifier.signMessage({ message: { raw: registerMessageByte } })
    await mining.write.register([REGISTER_DEVICE_ID, registerSignature])

    const address = await mining.read.accountOf([REGISTER_DEVICE_ID])
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
    const DEVICE_ID = nanoid(8)
    const CLAIM_ID = nanoid(8)
    const AMOUNT = 100n
    const rewards = [{ amount: AMOUNT, token: zeroAddress }]
    const { mining, viem, client, owner, verifier } = await loadFixture()

    const registerMessageByte = solidityPackedRegisterSignatureKeccak256(
      owner.account.address,
      DEVICE_ID,
    )
    const registerSignature = await verifier.signMessage({ message: { raw: registerMessageByte } })
    await mining.write.register([DEVICE_ID, registerSignature])
    await owner.sendTransaction({ to: mining.address, value: AMOUNT })

    const address = await mining.read.accountOf([DEVICE_ID])
    const account = await viem.getContractAt('ERC6551Account', address)

    const rewardsHash = solidityPackedCoinsKeccak256(rewards)
    const messageByte = solidityPackedClaimSignatureKeccak256(CLAIM_ID, DEVICE_ID, rewardsHash)

    // Sign the hash message
    const signature = await verifier.signMessage({ message: { raw: messageByte } })

    const encodeData = encodeFunctionData({
      abi: mining.abi,
      functionName: 'claim',
      args: [
        CLAIM_ID,
        DEVICE_ID,
        rewards,
        signature,
        false,
        '',
      ],
    })

    await account.write.execute([
      mining.address,
      0n,
      encodeData,
    ])
    const balance = await client.getBalance({ address })
    assert.equal(balance, AMOUNT)
  })

  // Test registering multiple devices for the same owner
  it('should be able to register multiple devices', async () => {
    const DEVICE_ID_1 = nanoid(8)
    const DEVICE_ID_2 = nanoid(8)
    const { mining, owner, verifier } = await loadFixture()
    await mining.write.register([DEVICE_ID_1, await verifier.signMessage({ message: { raw: solidityPackedRegisterSignatureKeccak256(owner.account.address, DEVICE_ID_1) } })])
    await mining.write.register([DEVICE_ID_2, await verifier.signMessage({ message: { raw: solidityPackedRegisterSignatureKeccak256(owner.account.address, DEVICE_ID_2) } })])

    const tm1 = await mining.read.tokenOf([DEVICE_ID_1])
    const tm2 = await mining.read.tokenOf([DEVICE_ID_2])

    assert.notEqual(tm1.tokenId, tm2.tokenId)
    assert.equal(await mining.read.ownerOf([tm1.tokenId]), owner.account.address)
    assert.equal(await mining.read.ownerOf([tm2.tokenId]), owner.account.address)
  })

  // Test claiming rewards with fuelling option enabled
  it('should be able claim with fuelling=true', async () => {
    const DEVICE_ID = nanoid(8)
    const CLAIM_ID = nanoid(8)
    const AMOUNT = 100n
    const rewards = [{ amount: AMOUNT, token: zeroAddress }]
    const { client, mining, viem, owner, verifier, fuel } = await loadFixture()

    assert.equal(await mining.read.fuel(), fuel.address)

    const registerMessageByte = solidityPackedRegisterSignatureKeccak256(
      owner.account.address,
      DEVICE_ID,
    )
    const registerSignature = await verifier.signMessage({ message: { raw: registerMessageByte } })
    await mining.write.register([DEVICE_ID, registerSignature])
    await owner.sendTransaction({ to: mining.address, value: AMOUNT })

    const address = await mining.read.accountOf([DEVICE_ID])
    const account = await viem.getContractAt('ERC6551Account', address)

    const rewardsHash = solidityPackedCoinsKeccak256(rewards)
    const messageByte = solidityPackedClaimSignatureKeccak256(CLAIM_ID, DEVICE_ID, rewardsHash)
    const signature = await verifier.signMessage({ message: { raw: messageByte } })

    const encodeMiningClamiData = encodeFunctionData({
      abi: mining.abi,
      functionName: 'claim',
      args: [
        CLAIM_ID,
        DEVICE_ID,
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
})
