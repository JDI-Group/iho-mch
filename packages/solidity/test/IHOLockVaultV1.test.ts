import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { network } from 'hardhat'
import { getAbiItem, getAddress } from 'viem'

import IHOLockVaultV1Module from '../ignition/modules/IHOLockVaultV1'
/**
 * Load test environment
 * Returns deployed contracts and test accounts
 */
async function loadFixture() {
  const { ignition, viem } = await network.connect()
  const { market } = await ignition.deploy(IHOLockVaultV1Module)
  const client = await viem.getPublicClient()
  const owner = await viem.getWalletClients().then(clients => clients[0])
  const verifier = await viem.getWalletClients().then(clients => clients[1])
  owner.account.address = getAddress(owner.account.address)
  verifier.account.address = getAddress(verifier.account.address)
  return {
    client,
    ignition,
    viem,
    market,
    owner,
    verifier,
  }
}
function randomProjectId(): bigint {
  return BigInt(Math.floor(Math.random() * 1000000) + 1)
}

describe('iHOLockVaultV1', async () => {
  it('should Mandatory confirmation of project', async () => {
    const pid = randomProjectId()
    const target = 10n
    const quantity = 0n
    const { market, client } = await loadFixture()

    await market.write.release([pid, target, quantity])

    // Verify project was created correctly
    const project = await market.read.getProject([pid])
    assert.equal(project.target, target)
    assert.equal(project.quantity, quantity)
    assert.equal(project.confirmed, false)

    await market.write.confirm([pid])

    // Verify project was confirmed
    const confirmedProject = await market.read.getProject([pid])
    assert.equal(confirmedProject.confirmed, true)

    const logs = await client.getLogs({
      event: getAbiItem({ abi: market.abi, name: 'ProjectConfirm' }),
    })

    assert.equal(logs.length, 1)
    assert.equal(logs[0]?.args.pid, pid)
  })
})
