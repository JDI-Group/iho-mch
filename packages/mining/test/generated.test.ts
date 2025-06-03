import { JsonRpcProvider as EthersClient, Contract as EthersContract } from 'ethers'
import { createPublicClient, getContract, http } from 'viem'
import { addresses, chains, ihoMiningAbi } from '../src/generated'

describe('generated', () => {
  it('ethers and Viem should have the same quantity', async () => {
    const clientViem = createPublicClient({ transport: http(), chain: chains.moonchainGeneva })
    const contractViem = getContract({ abi: ihoMiningAbi, address: addresses.IHOMining[5167004], client: clientViem })

    const clientEthers = new EthersClient(chains.moonchainGeneva.rpcUrls.default.http[0])
    const contractEthers = new EthersContract(addresses.IHOMining[5167004], ihoMiningAbi, clientEthers)

    const filterViem = await contractViem.createEventFilter.Registered({})
    const filterEthers = contractEthers.filters.Registered()

    const logsViem = await clientViem.getFilterLogs({ filter: filterViem })
    const logsEthers = await contractEthers.queryFilter(filterEthers)

    expect(logsViem.length).toEqual(logsEthers.length)
  })
})
