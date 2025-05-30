import type { Hex } from 'viem'
import { postSignRegister } from '@/apis'
import { useAsyncCallback } from '@hairy/react-lib'
import { Card, CardBody, Spinner } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useAccount } from 'wagmi'

export interface HomeMiningIncreaseProps {
  onRegistered?: () => void
}

export function HomeMiningIncrease(props: HomeMiningIncreaseProps) {
  const { address } = useAccount()
  const [loading, register] = useAsyncCallback(async () => {
    const { data: signature } = await postSignRegister({ address: address!, device: 'TEST-DEVICE' })
    const hash = await writeIhoMiningRegister({ args: ['TEST-DEVICE', signature as Hex] })
    await client.waitForTransactionReceipt({ hash })

    props.onRegistered?.()
  })

  return (
    <div onClick={!loading ? register : undefined}>
      <Card className="border-none w-[100px] h-[100px]" radius="lg" onClick={register}>
        <CardBody className="flex justify-center items-center">
          {loading ? <Spinner size="sm" variant="gradient" /> : <Icon fontSize="28" icon="ri:add-line" />}
        </CardBody>
      </Card>
    </div>
  )
}
