import { integer } from '@hairy/utils'
import { AbiCoder, isAddress, keccak256, solidityPackedKeccak256, toBeArray, ZeroAddress } from 'ethers'
import { contracts, provider, signer } from 'harsta/runtime'
import { fixture, initial, wait } from 'harsta/tests'

await initial()
await fixture(['IHO'])

const StakeNotExpiredError = `VM Exception while processing transaction: reverted with reason string 'Stake not expired'`
const ProjectAlreadyConfirmedError = `VM Exception while processing transaction: reverted with reason string 'Project already confirmed'`

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
  const iho = contracts.IHO.resolve('signer')
  const project: Project = {
    pid: +integer(random([1, 100000])),
    target: 1,
    quantity: 0,
    ...extendsProject,
  }
  const transaction = await iho.release(
    project.pid,
    project.target,
    project.quantity,
  )
  const receipt = await wait(transaction)
  return { params: project, transaction, receipt }
}

async function sign(pid: number, extendsParams?: Partial<typeof params>) {
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
  return signer.signMessage(toBeArray(messageHash))
}

function random(range: [number, number]) {
  return Math.random() * (range[1] - range[0]) + range[0]
}

describe('iho-project contract unit test', () => {
  it('provider get block number', async () => {
    const blockNumber = await provider.getBlockNumber()
    expect(blockNumber).toBeTypeOf('number')
  })

  it('deployed contract', async () => {
    const iho = contracts.IHO.resolve('signer')
    const address = await iho.getAddress()
    expect(isAddress(address)).toBeTruthy()
    expect(await signer.getAddress()).toBe(await iho.getVerifier())
    expect(await signer.getAddress()).toBe(await iho.owner())
  })

  it('release project', async () => {
    const iho = contracts.IHO.resolve('signer')
    const project = await release()

    const struct = await iho.getProject(project.params.pid)
    expect(project.params).toEqual({
      pid: project.params.pid,
      target: Number(struct.target),
      quantity: Number(struct.quantity),
    })
  })

  it('project stake and confirmed', async () => {
    const iho = contracts.IHO.resolve('signer')
    const project = await release()
    const message = await sign(project.params.pid)

    const transaction = await iho.stake(
      project.params.pid,
      params.oid,
      params.coins,
      params.expire,
      params.memo,
      message,
      { value: params.value },
    )
    const receipt = await wait(transaction)

    const StakeFilter = iho.filters.StakeConfirmed(
      await signer.getAddress(),
      project.params.pid,
      params.oid,
    )
    const StakeEvents = await iho.queryFilter(StakeFilter)
    expect(receipt?.blockNumber).toBe(StakeEvents[0].blockNumber)

    const ProjectConfirmedFilter = iho.filters.ProjectConfirmed(project.params.pid)
    const ProjectConfirmedEvents = await iho.queryFilter(ProjectConfirmedFilter)
    expect(receipt?.blockNumber).toBe(ProjectConfirmedEvents[0].blockNumber)
  })

  it('project stake and claim', async () => {
    const iho = contracts.IHO.resolve('signer')
    const project = await release()
    const message = await sign(project.params.pid)

    await wait(await iho.stake(
      project.params.pid,
      params.oid,
      params.coins,
      params.expire,
      params.memo,
      message,
      { value: params.value },
    ))

    await wait(await iho.claim(
      project.params.pid,
      params.oid,
    ))

    const stake = await iho.getStake(project.params.pid, params.oid)
    expect(stake.claimed).toBeTruthy()
  })

  it('project stake with invalid expire', async () => {
    const iho = contracts.IHO.resolve('signer')
    const project = await release()
    const _params = { ...params, expire: 1000 }
    const message = await sign(project.params.pid, _params)

    await wait(await iho.stake(
      project.params.pid,
      _params.oid,
      _params.coins,
      _params.expire,
      _params.memo,
      message,
      { value: _params.value },
    ))

    try {
      await iho.claim(
        project.params.pid,
        _params.oid,
      )
    }
    catch (error: any) {
      expect(error.error.message).toBe(StakeNotExpiredError)
    }
  })

  it('project with confirmed stake', async () => {
    const iho = contracts.IHO.resolve('signer')
    const project = await release()

    await wait(await iho.stake(
      project.params.pid,
      params.oid,
      params.coins,
      params.expire,
      params.memo,
      await sign(project.params.pid),
      { value: params.value },
    ))
    try {
      await wait(await iho.stake(
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
})
