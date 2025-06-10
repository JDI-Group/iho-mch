import type { Hex } from 'viem'
import { postSignRegisterDevice } from '@/apis'
import { useAsyncCallback } from '@hairy/react-lib'
import { addToast, Card, CardBody, Spinner } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useOverlayInject } from '@overlastic/react'
import { useAccount } from 'wagmi'

export interface HomeMiningIncreaseProps {
  onRegistered?: () => void
}

export function HomeMiningIncrease(props: HomeMiningIncreaseProps) {
  const { address } = useAccount()

  const openDeviceConfirmDialog = useOverlayInject(DeviceConfirmDialog)

  const [loading, register] = useAsyncCallback(async () => {
    const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true })

    await openDeviceConfirmDialog({ device })

    const { data: signature } = await postSignRegisterDevice({ owner: address!, name: device.name!, mac: device.id })
    const hash = await writeIhoMiningRegister({ args: [device.name!, device.id, signature as Hex] })

    await client.waitForTransactionReceipt({ hash })
    addToast({
      description: `Your device ${device.name} has been registered.`,
      title: 'Device registered successfully',
      color: 'success',
    })
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
