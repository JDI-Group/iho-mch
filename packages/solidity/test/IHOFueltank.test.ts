import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { network } from 'hardhat'
import { getAddress, parseEther, zeroAddress } from 'viem'
import IHOMiningModule from '../ignition/modules/IHOMining'

/**
 * Load test environment
 * Returns deployed contracts and test accounts
 */
async function loadFixture() {
  const { ignition, viem } = await network.connect()
  const { fuel } = await ignition.deploy(IHOMiningModule)
  const client = await viem.getPublicClient()
  const owner = await viem.getWalletClients().then(clients => clients[0])
  const user = await viem.getWalletClients().then(clients => clients[1])
  const user2 = await viem.getWalletClients().then(clients => clients[2])

  owner.account.address = getAddress(owner.account.address)
  user.account.address = getAddress(user.account.address)
  user2.account.address = getAddress(user2.account.address)

  return {
    client,
    ignition,
    viem,
    fuel,
    owner,
    user,
    user2,
  }
}

describe('IHOFueltank', async () => {
  // Test contract deployment and initialization
  it('should be able to deploy IHOFueltank module', async () => {
    const { fuel, owner } = await loadFixture()

    // Verify owner is correctly set
    assert.equal(await fuel.read.owner(), owner.account.address)

    // Verify locktime is correctly set to 30 days (in seconds)
    assert.equal(await fuel.read.locktime(), 30n * 86400n)
  })

  // Test ETH deposit functionality
  it('should be able to deposit ETH', async () => {
    const { fuel, user, user2, client } = await loadFixture()
    const AMOUNT = 100n

    // User1 deposits ETH to their own account
    await fuel.write.deposit(
      [user.account.address, zeroAddress, AMOUNT],
      { account: user.account, value: AMOUNT },
    )

    // Verify contract balance and user's balance in the fuel contract
    assert.equal(await client.getBalance({ address: fuel.address }), AMOUNT)
    assert.equal(await fuel.read.balanceOf([user.account.address, zeroAddress]), AMOUNT)

    await fuel.write.deposit(
      [user2.account.address, zeroAddress, AMOUNT],
      { account: user.account, value: AMOUNT },
    )

    // Verify contract balance increased and user2's balance in the fuel contract
    assert.equal(await client.getBalance({ address: fuel.address }), AMOUNT * 2n)
    assert.equal(await fuel.read.balanceOf([user2.account.address, zeroAddress]), AMOUNT)
  })

  // Test cancel functionality
  it('should be able to cancel deposit', async () => {
    const { fuel, user, client } = await loadFixture()
    const AMOUNT = 100n

    // User1 deposits ETH
    await fuel.write.deposit(
      [user.account.address, zeroAddress, AMOUNT],
      { account: user.account, value: AMOUNT },
    )

    // Verify initial balance, cancel half of the deposit
    assert.equal(await fuel.read.balanceOf([user.account.address, zeroAddress]), AMOUNT)
    await fuel.write.cancel([zeroAddress, AMOUNT / 2n], { account: user.account })
    // Verify balance decreased
    assert.equal(await fuel.read.balanceOf([user.account.address, zeroAddress]), AMOUNT / 2n)

    // Verify unlock tokens list
    const unlockCoins = await fuel.read.getUnlockCoins([user.account.address])
    assert.equal(unlockCoins.length, 1)
    assert.equal(unlockCoins[0].token, zeroAddress)
    assert.equal(unlockCoins[0].amount, AMOUNT / 2n)

    // Verify unlock time is current time plus locktime, allowing 1 second error margin
    const locktime = await fuel.read.locktime()
    const currentTimestamp = BigInt((await client.getBlock()).timestamp || 0)
    assert.ok(unlockCoins[0].timestamp >= currentTimestamp + locktime - 1n)
    assert.ok(unlockCoins[0].timestamp <= currentTimestamp + locktime + 1n)
  })

  // Test claim functionality
  it('should not be able to claim before locktime expires', async () => {
    const { fuel, user } = await loadFixture()
    const AMOUNT = 100n

    await fuel.write.deposit(
      [user.account.address, zeroAddress, AMOUNT],
      { account: user.account, value: AMOUNT },
    )
    await fuel.write.cancel([zeroAddress, AMOUNT], { account: user.account })

    // Try to claim immediately, should fail
    try {
      await fuel.write.claim([0n], { account: user.account })
      assert.fail('Should have thrown an error')
    }
    catch (error: any) {
      // Verify error message includes locktime not expired
      assert.ok(error.message.includes('LocktimeNotExpired'))
    }
  })

  // Test setting locktime functionality
  it('should be able to set locktime by owner', async () => {
    const { fuel, owner, user } = await loadFixture()
    const NEW_LOCKTIME = 10n // Set to 10 seconds for testing convenience

    // Owner sets new locktime, verify locktime is updated
    await fuel.write.setLocktime([NEW_LOCKTIME], { account: owner.account })
    assert.equal(await fuel.read.locktime(), NEW_LOCKTIME)

    // Non-owner tries to set locktime, should fail
    try {
      await fuel.write.setLocktime([100n], { account: user.account })
      assert.fail('Should have thrown an error')
    }
    catch (error: any) {
      // Verify error message includes permission error
      assert.ok(error.message.includes('OwnableUnauthorizedAccount'))
    }
  })

  // Test complete deposit-cancel-claim cycle
  it('should be able to complete deposit-cancel-claim cycle', async () => {
    const { fuel, owner, user, client } = await loadFixture()
    const NEW_LOCKTIME = 1n // Set to 1 second for testing convenience
    const AMOUNT = parseEther('100')

    // Owner sets short locktime for testing convenience
    await fuel.write.setLocktime([NEW_LOCKTIME], { account: owner.account })

    // User1 deposits ETH
    await fuel.write.deposit(
      [user.account.address, zeroAddress, AMOUNT],
      { account: user.account, value: AMOUNT },
    )

    // User1 cancels deposit
    await fuel.write.cancel([zeroAddress, AMOUNT], { account: user.account })

    // Record user1's initial balance
    const initialBalance = await client.getBalance({ address: user.account.address })

    // Wait for locktime to pass
    await new Promise(resolve => setTimeout(resolve, 1500)) // Wait 1.5 seconds

    // User1 claims funds
    await fuel.write.claim([0n], { account: user.account })

    // Verify user's balance in fuel contract is 0
    assert.equal(await fuel.read.balanceOf([user.account.address, zeroAddress]), 0n)

    // Verify user's ETH balance increased (considering gas fees, can only confirm balance increased)
    const finalBalance = await client.getBalance({ address: user.account.address })
    assert.ok(finalBalance > initialBalance, 'User balance should increase after claim')

    // Verify item in unlock tokens list is removed (amount becomes 0)
    const unlockCoins = await fuel.read.getUnlockCoins([user.account.address])
    assert.equal(unlockCoins[0].amount, 0n)
  })

  // Test deposit with zero amount
  it('should not allow deposit with zero amount', async () => {
    const { fuel, user } = await loadFixture()
    // Try to deposit 0 ETH, should fail
    try {
      await fuel.write.deposit(
        [user.account.address, zeroAddress, 0n],
        { account: user.account, value: 0n },
      )
      assert.fail('Should have thrown an error')
    }
    catch (error: any) {
      // Verify error message includes amount must be greater than 0
      assert.ok(error.message.includes('InvalidAmount'))
    }
  })

  // Test cancelling more than balance
  it('should not allow cancelling more than balance', async () => {
    const { fuel, user } = await loadFixture()
    const AMOUNT = 100n

    // User1 deposits ETH
    await fuel.write.deposit(
      [user.account.address, zeroAddress, AMOUNT],
      { account: user.account, value: AMOUNT },
    )

    // Try to cancel more than balance, should fail
    try {
      await fuel.write.cancel([zeroAddress, AMOUNT * 2n], { account: user.account })
      assert.fail('Should have thrown an error')
    }
    catch (error: any) {
      // Verify error message includes insufficient balance
      assert.ok(error.message.includes('InsufficientBalance'))
    }
  })

  // Test claiming non-existent index
  it('should not allow claiming non-existent index', async () => {
    const { fuel, user } = await loadFixture()

    // Try to claim non-existent index, should fail
    try {
      await fuel.write.claim([999n], { account: user.account })
      assert.fail('Should have thrown an error')
    }
    catch (error: any) {
      // Verify error message includes invalid index
      assert.ok(error.message.includes('InvalidIndex'))
    }
  })

  // Test claiming already claimed tokens
  it('should not allow claiming already claimed tokens', async () => {
    const { fuel, owner, user } = await loadFixture()
    const AMOUNT = 100n
    const NEW_LOCKTIME = 1n // Set to 1 second for testing convenience

    // Owner sets short locktime for testing convenience
    await fuel.write.setLocktime([NEW_LOCKTIME], { account: owner.account })

    // User1 deposits ETH
    await fuel.write.deposit(
      [user.account.address, zeroAddress, AMOUNT],
      { account: user.account, value: AMOUNT },
    )

    // User1 cancels deposit
    await fuel.write.cancel([zeroAddress, AMOUNT], { account: user.account })

    // Wait for locktime to pass
    await new Promise(resolve => setTimeout(resolve, 1500)) // Wait 1.5 seconds

    // User1 claims funds
    await fuel.write.claim([0n], { account: user.account })

    // Try to claim the same index again, should fail
    try {
      await fuel.write.claim([0n], { account: user.account })
      assert.fail('Should have thrown an error')
    }
    catch (error: any) {
      // Verify error message includes invalid index
      assert.ok(error.message.includes('InvalidIndex'))
    }
  })
})
