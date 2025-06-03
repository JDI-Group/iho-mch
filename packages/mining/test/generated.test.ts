import { JsonRpcProvider as EthersClient, Contract as EthersContract } from 'ethers'
import { createPublicClient, getAbiItem, http } from 'viem'
import { addresses, chains, ihoMiningAbi } from '../src/generated'

describe('generated', () => {
  it('ethers and Viem should have the same quantity', async () => {
    const clientViem = createPublicClient({ transport: http(), chain: chains.moonchainGeneva })

    const clientEthers = new EthersClient(chains.moonchainGeneva.rpcUrls.default.http[0])
    const contractEthers = new EthersContract(addresses.IHOMining[5167004], ihoMiningAbi, clientEthers)

    const filterEthers = contractEthers.filters.Registered()

    const logsViem = await clientViem.getLogs({
      event: getAbiItem({ abi: ihoMiningAbi, name: 'Registered' }),
      address: addresses.IHOMining[5167004],
      toBlock: 'latest',
      fromBlock: 0n,
    })
    const logsEthers = await contractEthers.queryFilter(filterEthers)

    expect(logsViem.length).toEqual(logsEthers.length)
  })
})
