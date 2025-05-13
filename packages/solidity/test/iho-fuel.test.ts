import { isAddress, ZeroAddress } from 'ethers'
import { contracts, getNamedSigner, provider, signer } from 'harsta/runtime'
import { fixture, initial, wait } from 'harsta/tests'

const LocktimeNotExpiredError = `VM Exception while processing transaction: reverted with reason string 'Locktime not expired'`
const NoAmountToClaimError = `VM Exception while processing transaction: reverted with reason string 'No amount to claim'`
const AmountMustBeGreaterThanZeroError = `VM Exception while processing transaction: reverted with reason string 'Amount must be greater than 0'`
await initial()

beforeEach(async () => await fixture(['IHOFuel']))

describe('iho-fuel contract unit test', () => {
  it('provider get block number', async () => {
    const blockNumber = await provider.getBlockNumber()
    expect(blockNumber).toBeTypeOf('number')
  })

  it('deployed contract', async () => {
    const ihoFuel = contracts.IHOFuel.resolve('signer')
    const address = await ihoFuel.getAddress()
    const deployer = await getNamedSigner('deployer')

    expect(isAddress(address)).toBeTruthy()
    expect(await deployer.getAddress()).toBe(await ihoFuel.owner())
  })

  it('get locktime', async () => {
    const ihoFuel = contracts.IHOFuel.resolve('signer')
    const locktime = await ihoFuel.getLocktime()

    // Default locktime is 30 days (30 * 86400 seconds)
    expect(locktime).toBe(BigInt(30 * 86400))
  })

  it('set locktime', async () => {
    const deployer = await getNamedSigner('deployer')
    const ihoFuel = contracts.IHOFuel.resolve(deployer)
    const newLocktime = 15 * 86400 // 15 days

    await wait(await ihoFuel.setLocktime(newLocktime))
    const locktime = await ihoFuel.getLocktime()

    expect(locktime).toBe(BigInt(newLocktime))

    // Reset to default for other tests
    await wait(await ihoFuel.setLocktime(30 * 86400))
  })

  it('deposit tokens', async () => {
    const ihoFuel = contracts.IHOFuel.resolve('signer')
    const address = await signer.getAddress()
    const token = ZeroAddress
    const amount = 100

    // Then deposit
    const depositTx = await ihoFuel.deposit(token, amount, { value: amount })
    const receipt = await wait(depositTx)

    const balance = await ihoFuel.balanceOf(address, token)
    expect(balance).toBe(BigInt(amount))

    // Check event
    const depositFilter = ihoFuel.filters.Deposited(
      await signer.getAddress(),
      token,
    )
    const depositEvents = await ihoFuel.queryFilter(depositFilter)
    expect(receipt?.blockNumber).toBe(depositEvents[0].blockNumber)
    expect(depositEvents[0].args[2]).toBe(BigInt(amount))
  })

  it('deposit with zero amount should fail', async () => {
    const ihoFuel = contracts.IHOFuel.resolve('signer')
    const token = ZeroAddress
    const amount = 0

    try {
      await ihoFuel.deposit(token, amount)
    }
    catch (error: any) {
      expect(error.error.message).toBe(AmountMustBeGreaterThanZeroError)
    }
  })

  it('cancel deposit', async () => {
    const ihoFuel = contracts.IHOFuel.resolve('signer')
    const token = ZeroAddress
    const amount = 100

    // Then deposit
    await wait(await ihoFuel.deposit(token, amount, { value: amount }))

    // Then cancel
    const transaction = await ihoFuel.cancel(token, amount)
    const receipt = await wait(transaction)

    // Check balance is reduced
    const balance = await ihoFuel.balanceOf(await signer.getAddress(), token)
    expect(balance).toBe(BigInt(0))

    // Check unlock coins
    const unlockCoins = await ihoFuel.getUnlockCoins(await signer.getAddress())
    expect(unlockCoins.length).toBeGreaterThan(0)
    expect(unlockCoins[0].token).toBe(token)
    expect(unlockCoins[0].amount).toBe(BigInt(amount))

    // Check event
    const cancelFilter = ihoFuel.filters.Cancelled(await signer.getAddress())
    const cancelEvents = await ihoFuel.queryFilter(cancelFilter)
    expect(receipt?.blockNumber).toBe(cancelEvents[0].blockNumber)
    expect(cancelEvents[0].args[2]).toBe(token)
    expect(cancelEvents[0].args[3]).toBe(BigInt(amount))
  })

  it('claim before locktime expires should fail', async () => {
    const ihoFuel = contracts.IHOFuel.resolve('signer')
    const token = ZeroAddress
    const amount = 100

    // Then deposit
    await wait(await ihoFuel.deposit(token, amount, { value: amount }))

    // Then cancel
    await wait(await ihoFuel.cancel(token, amount))

    // Try to claim immediately
    try {
      await ihoFuel.claim(0)
    }
    catch (error: any) {
      expect(error.error.message).toBe(LocktimeNotExpiredError)
    }
  })

  it('claim after locktime expires', async () => {
    const deployer = await getNamedSigner('deployer')
    const ihoFuel = contracts.IHOFuel.resolve(deployer)

    // Set locktime to 1 second for testing
    await wait(await ihoFuel.setLocktime(1))

    const userFuel = contracts.IHOFuel.resolve('signer')
    const token = ZeroAddress
    const amount = 100

    // Then deposit
    await wait(await userFuel.deposit(token, amount, { value: amount }))

    // Then cancel
    await wait(await userFuel.cancel(token, amount))

    // Wait for locktime to expire
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Now claim
    const transaction = await userFuel.claim(0)
    const receipt = await wait(transaction)

    // Check event
    const claimFilter = userFuel.filters.Claimed(
      await signer.getAddress(),
    )
    const claimEvents = await userFuel.queryFilter(claimFilter)
    expect(receipt?.blockNumber).toBe(claimEvents[0].blockNumber)
    expect(claimEvents[0].args[2]).toBe(token)
    expect(claimEvents[0].args[3]).toBe(BigInt(amount))

    // Reset locktime
    await wait(await ihoFuel.setLocktime(30 * 86400))
  })

  it('claim already claimed tokens should fail', async () => {
    const deployer = await getNamedSigner('deployer')
    const ihoFuel = contracts.IHOFuel.resolve(deployer)

    // Set locktime to 1 second for testing
    await wait(await ihoFuel.setLocktime(1))

    const userFuel = contracts.IHOFuel.resolve('signer')
    const token = ZeroAddress
    const amount = 100

    // Then deposit
    await wait(await userFuel.deposit(token, amount, { value: amount }))

    // Then cancel
    await wait(await userFuel.cancel(token, amount))

    // Wait for locktime to expire
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Claim
    await wait(await userFuel.claim(0))

    // Try to claim again
    try {
      await userFuel.claim(0)
    }
    catch (error: any) {
      expect(error.error.message).toBe(NoAmountToClaimError)
    }

    // Reset locktime
    await wait(await ihoFuel.setLocktime(30 * 86400))
  })
})
