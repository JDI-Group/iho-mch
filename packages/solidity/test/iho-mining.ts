import { isAddress, keccak256, solidityPackedKeccak256, toBeArray, ZeroAddress } from 'ethers'
import { contracts, getNamedSigner, provider, signer } from 'harsta/runtime'
import { fixture, initial, wait } from 'harsta/tests'

await initial()
await fixture(['IHOMining'])

const DeviceEmptyError = `VM Exception while processing transaction: reverted with custom error 'DeviceEmpty()'`
const DeviceRegisteredError = `VM Exception while processing transaction: reverted with custom error 'DeviceRegistered()'`
const DeviceUnregisteredError = `VM Exception while processing transaction: reverted with custom error 'DeviceUnregistered()'`
const ReceiveInvalidError = `VM Exception while processing transaction: reverted with custom error 'ReceiveInvalid()'`

async function sign(data: string | Uint8Array) {
  const verifier = await getNamedSigner('verifier')
  const messageHash = typeof data === 'string'
    ? solidityPackedKeccak256(['string'], [data])
    : keccak256(data)
  return verifier.signMessage(toBeArray(messageHash))
}

function random(range: [number, number]) {
  return Math.random() * (range[1] - range[0]) + range[0]
}

function generateDeviceId() {
  return `device-${Math.floor(random([1000, 9999]))}`
}

describe('iho-mining contract unit test', () => {
  it('provider get block number', async () => {
    const blockNumber = await provider.getBlockNumber()
    expect(blockNumber).toBeTypeOf('number')
  })

  it('deployed contract', async () => {
    const ihoMining = contracts.IHOMining.resolve('signer')
    const address = await ihoMining.getAddress()
    const verifier = await getNamedSigner('verifier')
    const deployer = await getNamedSigner('deployer')

    expect(isAddress(address)).toBeTruthy()
    expect(await verifier.getAddress()).toBe(await ihoMining.getVerifier())
    expect(await deployer.getAddress()).toBe(await ihoMining.owner())
  })

  it('register device', async () => {
    const ihoMining = contracts.IHOMining.resolve('signer')
    const deviceId = generateDeviceId()

    const transaction = await ihoMining.register(deviceId)
    const receipt = await wait(transaction)

    // Check event
    const registerFilter = ihoMining.filters.Registered(
      undefined,
      undefined,
      await signer.getAddress(),
    )
    const registerEvents = await ihoMining.queryFilter(registerFilter)
    expect(receipt?.blockNumber).toBe(registerEvents[0].blockNumber)
    expect(registerEvents[0].args[3]).toBe(deviceId)

    // Check total supply increased
    const totalSupply = await ihoMining.totalSupply()
    expect(totalSupply).toBeGreaterThan(0)
  })

  it('register with empty device id should fail', async () => {
    const ihoMining = contracts.IHOMining.resolve('signer')

    try {
      await ihoMining.register('')
    }
    catch (error: any) {
      expect(error.error.message).toBe(DeviceEmptyError)
    }
  })

  it('register already registered device should fail', async () => {
    const ihoMining = contracts.IHOMining.resolve('signer')
    const deviceId = generateDeviceId()

    // Register first time
    await wait(await ihoMining.register(deviceId))

    // Try to register again
    try {
      await ihoMining.register(deviceId)
    }
    catch (error: any) {
      expect(error.error.message).toBe(DeviceRegisteredError)
    }
  })

  it('reward receive', async () => {
    const ihoMining = contracts.IHOMining.resolve('signer')
    const deviceId = generateDeviceId()

    // Register device first
    await wait(await ihoMining.register(deviceId))

    // Prepare reward receive parameters
    const rewardId = `reward-${Math.floor(random([1000, 9999]))}`
    const amount = 100
    const memo = '{}'

    // Sign the message
    const message = await sign(
      solidityPackedKeccak256(
        ['string', 'address', 'string', 'uint256'],
        [rewardId, await signer.getAddress(), deviceId, amount],
      ),
    )

    // Receive reward
    const transaction = await ihoMining.rewardReceive(
      rewardId,
      await ihoMining.getAddress(),
      0, // tokenId
      deviceId,
      amount,
      message,
      memo,
    )
    const receipt = await wait(transaction)

    // Check event
    const receiveFilter = ihoMining.filters.Received(
      undefined,
      undefined,
      rewardId,
    )
    const receiveEvents = await ihoMining.queryFilter(receiveFilter)
    expect(receipt?.blockNumber).toBe(receiveEvents[0].blockNumber)
    expect(receiveEvents[0].args[3]).toBe(deviceId)
    expect(receiveEvents[0].args[5]).toBe(BigInt(amount))
    expect(receiveEvents[0].args[6]).toBe(memo)
  })

  it('reward receive with empty device id should fail', async () => {
    const ihoMining = contracts.IHOMining.resolve('signer')
    const rewardId = `reward-${Math.floor(random([1000, 9999]))}`
    const amount = 100

    // Sign the message
    const message = await sign(
      solidityPackedKeccak256(
        ['string', 'address', 'string', 'uint256'],
        [rewardId, await signer.getAddress(), '', amount],
      ),
    )

    try {
      await ihoMining.rewardReceive(
        rewardId,
        await ihoMining.getAddress(),
        0,
        '',
        amount,
        message,
        '{}',
      )
    }
    catch (error: any) {
      expect(error.error.message).toBe(DeviceEmptyError)
    }
  })

  it('reward receive with duplicate id should fail', async () => {
    const ihoMining = contracts.IHOMining.resolve('signer')
    const deviceId = generateDeviceId()

    // Register device first
    await wait(await ihoMining.register(deviceId))

    // Prepare reward receive parameters
    const rewardId = `reward-${Math.floor(random([1000, 9999]))}`
    const amount = 100

    // Sign the message
    const message = await sign(
      solidityPackedKeccak256(
        ['string', 'address', 'string', 'uint256'],
        [rewardId, await signer.getAddress(), deviceId, amount],
      ),
    )

    // Receive reward first time
    await wait(await ihoMining.rewardReceive(
      rewardId,
      await ihoMining.getAddress(),
      0,
      deviceId,
      amount,
      message,
      '{}',
    ))

    // Try to receive with same id again
    try {
      await ihoMining.rewardReceive(
        rewardId,
        await ihoMining.getAddress(),
        0,
        deviceId,
        amount,
        message,
        '{}',
      )
    }
    catch (error: any) {
      expect(error.error.message).toBe(ReceiveInvalidError)
    }
  })

  it('reward claim', async () => {
    const ihoMining = contracts.IHOMining.resolve('signer')
    const deviceId = generateDeviceId()

    // Register device first
    await wait(await ihoMining.register(deviceId))

    // Prepare reward receive parameters
    const rewardId = `reward-${Math.floor(random([1000, 9999]))}`
    const amount = 100

    // Sign the receive message
    const receiveMessage = await sign(
      solidityPackedKeccak256(
        ['string', 'address', 'string', 'uint256'],
        [rewardId, await signer.getAddress(), deviceId, amount],
      ),
    )

    // Receive reward
    await wait(await ihoMining.rewardReceive(
      rewardId,
      await ihoMining.getAddress(),
      0,
      deviceId,
      amount,
      receiveMessage,
      '{}',
    ))

    // Sign the claim message
    const claimMessage = await sign(
      solidityPackedKeccak256(
        ['address', 'string', 'uint256'],
        [await signer.getAddress(), deviceId, amount],
      ),
    )

    // First send ETH to contract
    await wait(await signer.sendTransaction({
      to: await ihoMining.getAddress(),
      value: amount,
    }))

    // Claim reward
    const transaction = await ihoMining.rewardClaim(
      await ihoMining.getAddress(),
      0,
      deviceId,
      amount,
      claimMessage,
    )
    const receipt = await wait(transaction)

    // Check event
    const claimFilter = ihoMining.filters.Claimed(
      undefined,
      undefined,
      deviceId,
    )
    const claimEvents = await ihoMining.queryFilter(claimFilter)
    expect(receipt?.blockNumber).toBe(claimEvents[0].blockNumber)
    expect(claimEvents[0].args[3]).toBe(await signer.getAddress())
    expect(claimEvents[0].args[4]).toBe(BigInt(amount))
  })

  it('reward claim with empty device id should fail', async () => {
    const ihoMining = contracts.IHOMining.resolve('signer')
    const amount = 100

    // Sign the claim message
    const claimMessage = await sign(
      solidityPackedKeccak256(
        ['address', 'string', 'uint256'],
        [await signer.getAddress(), '', amount],
      ),
    )

    try {
      await ihoMining.rewardClaim(
        await ihoMining.getAddress(),
        0,
        '',
        amount,
        claimMessage,
      )
    }
    catch (error: any) {
      expect(error.error.message).toBe(DeviceEmptyError)
    }
  })

  it('reward claim with unregistered device should fail', async () => {
    const ihoMining = contracts.IHOMining.resolve('signer')
    const deviceId = `unregistered-${Math.floor(random([1000, 9999]))}`
    const amount = 100

    // Sign the claim message
    const claimMessage = await sign(
      solidityPackedKeccak256(
        ['address', 'string', 'uint256'],
        [await signer.getAddress(), deviceId, amount],
      ),
    )

    try {
      await ihoMining.rewardClaim(
        ZeroAddress, // This will trigger DeviceUnregistered error
        0,
        deviceId,
        amount,
        claimMessage,
      )
    }
    catch (error: any) {
      expect(error.error.message).toBe(DeviceUnregisteredError)
    }
  })
})
