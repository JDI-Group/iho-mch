import { AbiCoder, isAddress, keccak256, solidityPackedKeccak256, toBeArray } from 'ethers'
import { contracts, provider, signer } from 'harsta/runtime'
import { fixture, initial } from 'harsta/tests'
import { zeroAddress } from 'viem'

await initial()
await fixture(['IHO_Legacy'])

const TransferFailedError = `VM Exception while processing transaction: reverted with custom error 'TransferFailed()'`
const InvalidSignatureError = `VM Exception while processing transaction: reverted with custom error 'InvalidSignature()'`
const abiCoder = AbiCoder.defaultAbiCoder()

function signMessage(params: any) {
  const encoded = abiCoder.encode(
    ['tuple(address token, uint256 amount)[]'],
    [params.prices],
  )
  const encodedHash = keccak256(encoded)
  const messageHash = solidityPackedKeccak256(
    ['uint256', 'uint256', 'bytes32', 'uint256', 'string'],
    [params.pid, params.oid, encodedHash, params.expire, params.memo],
  )
  return signer.signMessage(toBeArray(messageHash))
}

const params = {
  pid: 19859,
  oid: 0,
  prices: [{ token: zeroAddress as string, amount: '100' }],
  expire: 0,
  memo: '{}',
  value: '100',
}

describe('iho-legacy contract unit test', () => {
  it('provider get block number', async () => {
    const blockNumber = await provider.getBlockNumber()
    expect(blockNumber).toBeTypeOf('number')
  })

  it('deployed contract', async () => {
    const iho = contracts.IHO_Legacy.resolve('signer')
    const address = await iho.getAddress()
    expect(isAddress(address)).toBeTruthy()
    expect(await signer.getAddress()).toBe(await iho.getVerifier())
    expect(await signer.getAddress()).toBe(await iho.owner())
  })

  it('iho function create call', async () => {
    const iho = contracts.IHO_Legacy.resolve('signer')
    const messageByte = await signMessage(params)

    const confirmed = new Promise((resolve) => {
      iho.once(iho.filters.Confirmed, async (from, pid, oid, prices, expire, memo, event) => {
        const log: typeof event = (event as any).log || event
        const transaction = await provider.getTransaction(log.transactionHash)
        resolve({
          prices: prices.map(price => ({
            amount: price.amount.toString(),
            token: price.token,
          })),
          value: transaction?.value.toString(),
          expire: Number(expire),
          pid: Number(pid),
          oid: Number(oid),
          memo,
        })
      })
    })

    await iho.create(
      params.pid,
      params.oid,
      params.prices,
      params.expire,
      params.memo,
      messageByte,
      { value: params.prices[0].amount },
    )

    expect(params).toEqual(await confirmed)
  })

  it('iho function create TransferFailed error', async () => {
    const iho = contracts.IHO_Legacy.resolve('signer')
    const messageByte = await signMessage(params)

    try {
      await iho.create(
        params.pid,
        params.oid,
        params.prices,
        params.expire,
        params.memo,
        messageByte,
        { value: '0' },
      )
    }
    catch (error: any) {
      expect(error.error.message).toBe(TransferFailedError)
    }
  })

  it('iho function create InvalidSignature error', async () => {
    const iho = contracts.IHO_Legacy.resolve('signer')
    const messageByte = await signMessage(params)

    try {
      await iho.create(
        params.pid,
        params.oid,
        params.prices,
        1000,
        params.memo,
        messageByte,
        { value: '0' },
      )
    }
    catch (error: any) {
      expect(error.error.message).toBe(InvalidSignatureError)
    }
  })
})
