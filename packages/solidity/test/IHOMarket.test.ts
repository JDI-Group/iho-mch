import type { Address, Hash } from 'viem'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { network } from 'hardhat'
import { nanoid } from 'nanoid'
import { 
  encodeAbiParameters, 
  encodePacked, 
  getAddress, 
  keccak256, 
  parseEther, 
  zeroAddress 
} from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import IHOMarketModule from '../ignition/modules/IHOMarket'

/**
 * Load test environment
 * Returns deployed contracts and test accounts
 */
async function loadFixture() {
  const { ignition, viem } = await network.connect()
  const { market } = await ignition.deploy(IHOMarketModule)
  const client = await viem.getPublicClient()
  const owner = await viem.getWalletClients().then(clients => clients[0])
  const verifier = await viem.getWalletClients().then(clients => clients[1])
  const user = await viem.getWalletClients().then(clients => clients[2])
  const user2 = await viem.getWalletClients().then(clients => clients[3])

  // Normalize addresses
  owner.account.address = getAddress(owner.account.address)
  verifier.account.address = getAddress(verifier.account.address)
  user.account.address = getAddress(user.account.address)
  user2.account.address = getAddress(user2.account.address)

  return {
    client,
    ignition,
    viem,
    market,
    owner,
    verifier,
    user,
    user2,
  }
}

/**
 * Calculate keccak256 hash of coins array for signature verification
 * @param coins Array of token and amount pairs
 * @returns Hash of encoded coins data
 */
function solidityPackedCoinsKeccak256(coins: { token: Address, amount: bigint }[]) {
  const coinsEncoded = encodeAbiParameters(
    [{
      type: 'tuple[]',
      components: [
        { type: 'address', name: 'token' },
        { type: 'uint256', name: 'amount' },
      ],
    }],
    [coins],
  )
  return keccak256(coinsEncoded)
}

/**
 * Calculate keccak256 hash for stake signature verification
 * @param pid Project ID
 * @param oid Order ID
 * @param coinsHash Hash of coins array
 * @param expire Expiration time in seconds
 * @param memo Memo string
 * @returns Hash for signature verification
 */
function solidityPackedStakeSignatureKeccak256(
  pid: bigint,
  oid: bigint,
  coinsHash: Hash,
  expire: bigint,
  memo: string,
) {
  const packed = encodePacked(
    ['uint256', 'uint256', 'bytes32', 'uint256', 'string'],
    [pid, oid, coinsHash, expire, memo],
  )
  return keccak256(packed)
}

/**
 * Generate a random project ID
 */
function randomProjectId(): bigint {
  return BigInt(Math.floor(Math.random() * 1000000) + 1)
}

describe('IHOMarket', async () => {
  // Test contract deployment and initialization
  it('should be able to deploy IHOMarket module', async () => {
    const { market, owner, verifier } = await loadFixture()

    // Verify owner is correctly set
    assert.equal(await market.read.owner(), owner.account.address)
    
    // Verify verifier is correctly set  
    assert.equal(await market.read.verifier(), verifier.account.address)
  })

  // Test project release functionality
  it('should be able to release a project', async () => {
    const { market, owner } = await loadFixture()
    const pid = randomProjectId()
    const target = 10n
    const quantity = 0n

    // Release project
    await market.write.release([pid, target, quantity], { account: owner.account })

    // Verify project was created correctly
    const project = await market.read.getProject([pid])
    assert.equal(project.target, target)
    assert.equal(project.quantity, quantity)
    assert.equal(project.confirmed, false)
  })

  // Test only owner can release projects
  it('should not allow non-owner to release project', async () => {
    const { market, user } = await loadFixture()
    const pid = randomProjectId()

    try {
      await market.write.release([pid, 10n, 0n], { account: user.account })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.ok(error.message.includes('OwnableUnauthorizedAccount'))
    }
  })

  // Test project already exists error
  it('should not allow duplicate project IDs', async () => {
    const { market, owner } = await loadFixture()
    const pid = randomProjectId()

    // Release first project
    await market.write.release([pid, 10n, 0n], { account: owner.account })

    try {
      // Try to release same project ID again
      await market.write.release([pid, 5n, 0n], { account: owner.account })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.ok(error.message.includes('ProjectAlreadyExists'))
    }
  })

  // Test invalid target amount
  it('should not allow zero target amount', async () => {
    const { market, owner } = await loadFixture()
    const pid = randomProjectId()

    try {
      await market.write.release([pid, 0n, 0n], { account: owner.account })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.ok(error.message.includes('InvalidTargetAmount'))
    }
  })

  // Test ETH staking functionality
  it('should be able to stake ETH', async () => {
    const { market, owner, verifier, user, client } = await loadFixture()
    const pid = randomProjectId()
    const oid = 1n
    const amount = parseEther('1')
    const expire = 3600n // 1 hour
    const memo = 'Test stake'
    const coins = [{ token: zeroAddress, amount }]

    // Release project first
    await market.write.release([pid, 1n, 0n], { account: owner.account })

    // Generate signature
    const coinsHash = solidityPackedCoinsKeccak256(coins)
    const messageHash = solidityPackedStakeSignatureKeccak256(pid, oid, coinsHash, expire, memo)
    const signature = await verifier.signMessage({ message: { raw: messageHash } })

    // Record initial contract balance
    const initialBalance = await client.getBalance({ address: market.address })

    // Stake ETH
    await market.write.stake([pid, oid, coins, expire, memo, signature], {
      account: user.account,
      value: amount,
    })

    // Verify contract received ETH
    const finalBalance = await client.getBalance({ address: market.address })
    assert.equal(finalBalance - initialBalance, amount)

    // Verify stake was recorded
    const stake = await market.read.getStake([pid, oid])
    assert.equal(stake.coins.length, 1)
    assert.equal(stake.coins[0].token, zeroAddress)
    assert.equal(stake.coins[0].amount, amount)
    assert.equal(stake.claimed, false)

    // Verify project quantity increased
    const project = await market.read.getProject([pid])
    assert.equal(project.quantity, 1n)
  })

  // Test project confirmation when target is reached
  it('should confirm project when target is reached', async () => {
    const { market, owner, verifier, user, user2 } = await loadFixture()
    const pid = randomProjectId()
    const amount = parseEther('1')
    const expire = 3600n
    const memo = 'Test stake'
    const coins = [{ token: zeroAddress, amount }]

    // Release project with target of 2
    await market.write.release([pid, 2n, 0n], { account: owner.account })

    // First stake (should not confirm project yet)
    const coinsHash = solidityPackedCoinsKeccak256(coins)
    let messageHash = solidityPackedStakeSignatureKeccak256(pid, 1n, coinsHash, expire, memo)
    let signature = await verifier.signMessage({ message: { raw: messageHash } })

    await market.write.stake([pid, 1n, coins, expire, memo, signature], {
      account: user.account,
      value: amount,
    })

    let project = await market.read.getProject([pid])
    assert.equal(project.confirmed, false)
    assert.equal(project.quantity, 1n)

    // Second stake (should confirm project)
    messageHash = solidityPackedStakeSignatureKeccak256(pid, 2n, coinsHash, expire, memo)
    signature = await verifier.signMessage({ message: { raw: messageHash } })

    await market.write.stake([pid, 2n, coins, expire, memo, signature], {
      account: user2.account,
      value: amount,
    })

    project = await market.read.getProject([pid])
    assert.equal(project.confirmed, true)
    assert.equal(project.quantity, 2n)
  })

  // Test cannot stake on confirmed project
  it('should not allow staking on confirmed project', async () => {
    const { market, owner, verifier, user, user2 } = await loadFixture()
    const pid = randomProjectId()
    const amount = parseEther('1')
    const expire = 3600n
    const memo = 'Test stake'
    const coins = [{ token: zeroAddress, amount }]

    // Release project with target of 1
    await market.write.release([pid, 1n, 0n], { account: owner.account })

    // First stake (should confirm project)
    const coinsHash = solidityPackedCoinsKeccak256(coins)
    let messageHash = solidityPackedStakeSignatureKeccak256(pid, 1n, coinsHash, expire, memo)
    let signature = await verifier.signMessage({ message: { raw: messageHash } })

    await market.write.stake([pid, 1n, coins, expire, memo, signature], {
      account: user.account,
      value: amount,
    })

    // Try to stake again on confirmed project
    messageHash = solidityPackedStakeSignatureKeccak256(pid, 2n, coinsHash, expire, memo)
    signature = await verifier.signMessage({ message: { raw: messageHash } })

    try {
      await market.write.stake([pid, 2n, coins, expire, memo, signature], {
        account: user2.account,
        value: amount,
      })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.ok(error.message.includes('ProjectAlreadyConfirmed'))
    }
  })

  // Test cannot stake with duplicate order ID
  it('should not allow duplicate order IDs', async () => {
    const { market, owner, verifier, user } = await loadFixture()
    const pid = randomProjectId()
    const oid = 1n
    const amount = parseEther('1')
    const expire = 3600n
    const memo = 'Test stake'
    const coins = [{ token: zeroAddress, amount }]

    // Release project
    await market.write.release([pid, 10n, 0n], { account: owner.account })

    // First stake
    const coinsHash = solidityPackedCoinsKeccak256(coins)
    const messageHash = solidityPackedStakeSignatureKeccak256(pid, oid, coinsHash, expire, memo)
    const signature = await verifier.signMessage({ message: { raw: messageHash } })

    await market.write.stake([pid, oid, coins, expire, memo, signature], {
      account: user.account,
      value: amount,
    })

    // Try to use same order ID again
    try {
      await market.write.stake([pid, oid, coins, expire, memo, signature], {
        account: user.account,
        value: amount,
      })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.ok(error.message.includes('StakeAlreadyExists'))
    }
  })

  // Test invalid signature
  it('should reject invalid signature', async () => {
    const { market, owner, user } = await loadFixture()
    const pid = randomProjectId()
    const oid = 1n
    const amount = parseEther('1')
    const expire = 3600n
    const memo = 'Test stake'
    const coins = [{ token: zeroAddress, amount }]

    // Release project
    await market.write.release([pid, 1n, 0n], { account: owner.account })

    // Create fake signature
    const fakeAccount = privateKeyToAccount(generatePrivateKey())
    const coinsHash = solidityPackedCoinsKeccak256(coins)
    const messageHash = solidityPackedStakeSignatureKeccak256(pid, oid, coinsHash, expire, memo)
    const fakeSignature = await fakeAccount.signMessage({ message: { raw: messageHash } })

    try {
      await market.write.stake([pid, oid, coins, expire, memo, fakeSignature], {
        account: user.account,
        value: amount,
      })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.ok(error.message.includes('InvalidSignature'))
    }
  })

  // Test claiming after expiration
  it('should be able to claim after expiration', async () => {
    const { market, owner, verifier, user, client } = await loadFixture()
    const pid = randomProjectId()
    const oid = 1n
    const amount = parseEther('1')
    const expire = 1n // 1 second for quick testing
    const memo = 'Test stake'
    const coins = [{ token: zeroAddress, amount }]

    // Release project
    await market.write.release([pid, 10n, 0n], { account: owner.account })

    // Stake ETH
    const coinsHash = solidityPackedCoinsKeccak256(coins)
    const messageHash = solidityPackedStakeSignatureKeccak256(pid, oid, coinsHash, expire, memo)
    const signature = await verifier.signMessage({ message: { raw: messageHash } })

    await market.write.stake([pid, oid, coins, expire, memo, signature], {
      account: user.account,
      value: amount,
    })

    // Record user's initial balance
    const initialBalance = await client.getBalance({ address: user.account.address })

    // Wait for expiration with longer timeout
    await new Promise(resolve => setTimeout(resolve, 3000)) // Wait 3 seconds to be safe

    // Claim stake
    await market.write.claim([pid, oid], { account: user.account })

    // Verify stake is marked as claimed
    const stake = await market.read.getStake([pid, oid])
    assert.equal(stake.claimed, true)

    // Verify user received ETH back (balance should increase)
    const finalBalance = await client.getBalance({ address: user.account.address }) 
    assert.ok(finalBalance > initialBalance, 'User balance should increase after claim')
  })

  // Test cannot claim before expiration
  it('should not allow claiming before expiration', async () => {
    const { market, owner, verifier, user } = await loadFixture()
    const pid = randomProjectId()
    const oid = 1n
    const amount = parseEther('1')
    const expire = 3600n // 1 hour
    const memo = 'Test stake'
    const coins = [{ token: zeroAddress, amount }]

    // Release project and stake
    await market.write.release([pid, 10n, 0n], { account: owner.account })

    const coinsHash = solidityPackedCoinsKeccak256(coins)
    const messageHash = solidityPackedStakeSignatureKeccak256(pid, oid, coinsHash, expire, memo)
    const signature = await verifier.signMessage({ message: { raw: messageHash } })

    await market.write.stake([pid, oid, coins, expire, memo, signature], {
      account: user.account,
      value: amount,
    })

    // Try to claim immediately
    try {
      await market.write.claim([pid, oid], { account: user.account })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.ok(error.message.includes('StakeNotExpired'))
    }
  })

  // Test cannot claim twice
  it('should not allow claiming twice', async () => {
    const { market, owner, verifier, user } = await loadFixture() 
    const pid = randomProjectId()
    const oid = 1n
    const amount = parseEther('1')
    const expire = 1n // 1 second
    const memo = 'Test stake'
    const coins = [{ token: zeroAddress, amount }]

    // Release project and stake
    await market.write.release([pid, 10n, 0n], { account: owner.account })

    const coinsHash = solidityPackedCoinsKeccak256(coins)
    const messageHash = solidityPackedStakeSignatureKeccak256(pid, oid, coinsHash, expire, memo)
    const signature = await verifier.signMessage({ message: { raw: messageHash } })

    await market.write.stake([pid, oid, coins, expire, memo, signature], {
      account: user.account,
      value: amount,
    })

    // Wait for expiration with longer timeout
    await new Promise(resolve => setTimeout(resolve, 3000)) // Wait 3 seconds to be safe
    
    await market.write.claim([pid, oid], { account: user.account })

    // Try to claim again
    try {
      await market.write.claim([pid, oid], { account: user.account })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.ok(error.message.includes('StakeAlreadyClaimed'))
    }
  })

  // Test owner withdrawal functionality
  it('should allow owner to withdraw funds', async () => {
    const { market, owner, verifier, user, client } = await loadFixture()
    const pid = randomProjectId()
    const oid = 1n
    const amount = parseEther('1')
    const expire = 3600n
    const memo = 'Test stake'
    const coins = [{ token: zeroAddress, amount }]

    // Release project and stake
    await market.write.release([pid, 1n, 0n], { account: owner.account })

    const coinsHash = solidityPackedCoinsKeccak256(coins)
    const messageHash = solidityPackedStakeSignatureKeccak256(pid, oid, coinsHash, expire, memo)
    const signature = await verifier.signMessage({ message: { raw: messageHash } })

    await market.write.stake([pid, oid, coins, expire, memo, signature], {
      account: user.account,
      value: amount,
    })

    // Record owner's initial balance
    const initialBalance = await client.getBalance({ address: owner.account.address })

    // Owner withdraws ETH
    await market.write.withdraw([zeroAddress, amount], { account: owner.account })

    // Verify owner received ETH
    const finalBalance = await client.getBalance({ address: owner.account.address })
    assert.ok(finalBalance > initialBalance, 'Owner balance should increase after withdrawal')
  })

  // Test non-owner cannot withdraw
  it('should not allow non-owner to withdraw', async () => {
    const { market, user } = await loadFixture()
    
    try {
      await market.write.withdraw([zeroAddress, parseEther('1')], { account: user.account })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.ok(error.message.includes('OwnableUnauthorizedAccount'))
    }
  })

  // Test staking on non-existent project
  it('should not allow staking on non-existent project', async () => {
    const { market, verifier, user } = await loadFixture()
    const pid = 999999n // Non-existent project
    const oid = 1n
    const amount = parseEther('1')
    const expire = 3600n
    const memo = 'Test stake'
    const coins = [{ token: zeroAddress, amount }]

    const coinsHash = solidityPackedCoinsKeccak256(coins)
    const messageHash = solidityPackedStakeSignatureKeccak256(pid, oid, coinsHash, expire, memo)
    const signature = await verifier.signMessage({ message: { raw: messageHash } })

    try {
      await market.write.stake([pid, oid, coins, expire, memo, signature], {
        account: user.account,
        value: amount,
      })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert.ok(error.message.includes('ProjectNotFound'))
    }
  })
})
