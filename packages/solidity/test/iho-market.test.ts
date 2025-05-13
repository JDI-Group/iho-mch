import { integer } from '@hairy/utils'
import { AbiCoder, isAddress, keccak256, solidityPackedKeccak256, toBeArray, ZeroAddress } from 'ethers'
import { contracts, getNamedSigner, provider, signer } from 'harsta/runtime'
import { fixture, initial, wait } from 'harsta/tests'

await initial()
await fixture(['IHOMarket'])

const StakeNotExpiredError = `VM Exception while processing transaction: reverted with reason string 'Stake not expired'`
const ProjectAlreadyConfirmedError = `VM Exception while processing transaction: reverted with reason string 'Project already confirmed'`
const StakeAlreadyConfirmedError = `VM Exception while processing transaction: reverted with reason string 'Stake already exists'`

const abiCoder = AbiCoder.defaultAbiCoder()
const params = {
  oid: 0,
  coins: [{ token: ZeroAddress as string, amount: '100' }],
  value: '100',
  expire: 0,
  memo: '{}',
}

interface Project {
  pid: number
  target: number
  quantity: number
}

async function release(extendsProject?: Partial<Project>) {
  const deployer = await getNamedSigner('deployer')
  const ihoMarket = contracts.IHOMarket.resolve(deployer)
  const project: Project = {
    pid: +integer(random([1, 100000])),
    target: 1,
    quantity: 0,
    ...extendsProject,
  }
  const transaction = await ihoMarket.release(
    project.pid,
    project.target,
    project.quantity,
  )
  const receipt = await wait(transaction)
  return { params: project, transaction, receipt }
}

async function sign(pid: number, extendsParams?: Partial<typeof params>) {
  const verifier = await getNamedSigner('verifier')
  const _params = { ...params, ...extendsParams }
  const encoded = abiCoder.encode(
    ['tuple(address token, uint256 amount)[]'],
    [_params.coins],
  )
  const encodedHash = keccak256(encoded)
  const messageHash = solidityPackedKeccak256(
    ['uint256', 'uint256', 'bytes32', 'uint256', 'string'],
    [pid, _params.oid, encodedHash, _params.expire, _params.memo],
  )
  return verifier.signMessage(toBeArray(messageHash))
}

function random(range: [number, number]) {
  return Math.random() * (range[1] - range[0]) + range[0]
}

describe('iho-market contract unit test', () => {
  it('provider get block number', async () => {
    const blockNumber = await provider.getBlockNumber()
    expect(blockNumber).toBeTypeOf('number')
  })

  it('deployed contract', async () => {
    const ihoMarket = contracts.IHOMarket.resolve('signer')
    const address = await ihoMarket.getAddress()
    const verifier = await getNamedSigner('verifier')
    const deployer = await getNamedSigner('deployer')

    expect(isAddress(address)).toBeTruthy()
    expect(await verifier.getAddress()).toBe(await ihoMarket.getVerifier())
    expect(await deployer.getAddress()).toBe(await ihoMarket.owner())
  })

  it('release project', async () => {
    const ihoMarket = contracts.IHOMarket.resolve('signer')
    const project = await release()

    const struct = await ihoMarket.getProject(project.params.pid)
    expect(project.params).toEqual({
      pid: project.params.pid,
      target: Number(struct.target),
      quantity: Number(struct.quantity),
    })
  })

  it('project stake and confirmed', async () => {
    const ihoMarket = contracts.IHOMarket.resolve('signer')
    const project = await release()
    const message = await sign(project.params.pid)

    const transaction = await ihoMarket.stake(
      project.params.pid,
      params.oid,
      params.coins,
      params.expire,
      params.memo,
      message,
      { value: params.value },
    )
    const receipt = await wait(transaction)

    const StakeFilter = ihoMarket.filters.StakeConfirmed(
      await signer.getAddress(),
      project.params.pid,
      params.oid,
    )
    const StakeEvents = await ihoMarket.queryFilter(StakeFilter)
    expect(receipt?.blockNumber).toBe(StakeEvents[0].blockNumber)

    const ProjectConfirmedFilter = ihoMarket.filters.ProjectConfirmed(project.params.pid)
    const ProjectConfirmedEvents = await ihoMarket.queryFilter(ProjectConfirmedFilter)
    expect(receipt?.blockNumber).toBe(ProjectConfirmedEvents[0].blockNumber)
  })

  it('project stake and claim', async () => {
    const ihoMarket = contracts.IHOMarket.resolve('signer')
    const project = await release()
    const message = await sign(project.params.pid)

    await wait(await ihoMarket.stake(
      project.params.pid,
      params.oid,
      params.coins,
      params.expire,
      params.memo,
      message,
      { value: params.value },
    ))

    await wait(await ihoMarket.claim(
      project.params.pid,
      params.oid,
    ))

    const stake = await ihoMarket.getStake(project.params.pid, params.oid)
    expect(stake.claimed).toBeTruthy()
  })

  it('project stake with invalid expire', async () => {
    const ihoMarket = contracts.IHOMarket.resolve('signer')
    const project = await release()
    const _params = { ...params, expire: 1000 }
    const message = await sign(project.params.pid, _params)

    await wait(await ihoMarket.stake(
      project.params.pid,
      _params.oid,
      _params.coins,
      _params.expire,
      _params.memo,
      message,
      { value: _params.value },
    ))

    try {
      await ihoMarket.claim(
        project.params.pid,
        _params.oid,
      )
    }
    catch (error: any) {
      expect(error.error.message).toBe(StakeNotExpiredError)
    }
  })

  it('project with confirmed stake', async () => {
    const ihoMarket = contracts.IHOMarket.resolve('signer')
    const project = await release()

    await wait(await ihoMarket.stake(
      project.params.pid,
      params.oid,
      params.coins,
      params.expire,
      params.memo,
      await sign(project.params.pid),
      { value: params.value },
    ))
    try {
      await wait(await ihoMarket.stake(
        project.params.pid,
        2,
        params.coins,
        params.expire,
        params.memo,
        await sign(project.params.pid, { oid: 2 }),
        { value: params.value },
      ))
    }
    catch (error: any) {
      expect(error.error.message).toBe(ProjectAlreadyConfirmedError)
    }
  })

  it('repeat stake error', async () => {
    const ihoMarket = contracts.IHOMarket.resolve('signer')
    const project = await release({ target: 20 })

    await wait(await ihoMarket.stake(
      project.params.pid,
      params.oid,
      params.coins,
      params.expire,
      params.memo,
      await sign(project.params.pid),
      { value: params.value },
    ))
    try {
      await wait(await ihoMarket.stake(
        project.params.pid,
        params.oid,
        params.coins,
        params.expire,
        params.memo,
        await sign(project.params.pid),
        { value: params.value },
      ))
    }
    catch (error: any) {
      expect(error.error.message).toBe(StakeAlreadyConfirmedError)
    }
  })
})
