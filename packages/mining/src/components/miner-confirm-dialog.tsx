import type { DeviceMetadata } from '@/types'
import type { Hex } from 'viem'
import { fonts } from '@/config/fonts'
import { useAsyncCallback } from '@hairy/react-lib'
import { Button, Chip, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { useExtendOverlay } from '@overlastic/react'
import { useAccount } from 'wagmi'

export interface MinerConfirmDialogProps {
  device: DeviceMetadata
}

export function MinerConfirmDialog(props: MinerConfirmDialogProps) {
  const overlay = useExtendOverlay({ duration: 300 })
  const { address } = useAccount()

  const [loading, register] = useAsyncCallback(async () => {
    const { data: signature } = await postSignRegisterDevice({
      product: props.device.product,
      name: props.device.name,
      mac: props.device.id,
      owner: address!,
    })

    const hash = await writeIhoMiningRegister({
      args: [
        BigInt(props.device.product),
        props.device.name!,
        props.device.id,
        signature as Hex,
      ],
    })
    overlay.resolve(hash)
  })

  function cancel() {
    if (loading)
      return
    overlay.reject()
  }
  return (
    <Modal className={fonts.barlow.className} isOpen={overlay.visible} onOpenChange={cancel}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Confirm Your Device
        </ModalHeader>
        <ModalBody className="py-0">
          <div className="space-y-4">
            <p className="text-sm">
              Do you want to register the following device？
            </p>
            <div className="flex gap-2">
              <Image
                alt="Woman listing to music"
                className="object-cover"
                height={80}
                src={props.device.image}
                width={80}
              />
              <div className="flex flex-col">
                <div className="text-sm mb-2 mt-1 font-bold">{props.device.name || 'Unknown Device'}</div>
                <div className="flex gap-1 mb-1">
                  <Chip size="sm" className="h-[18px] text-tiny text-default-500">
                    No traits
                  </Chip>
                  {/* <Chip size="sm" className="h-[18px] text-tiny">Headset</Chip>
                  <Chip size="sm" className="h-[18px] text-tiny">Virtual</Chip> */}
                </div>
                <Chip size="sm" className="h-[18px] text-tiny bg-default-700 text-default-50 px-1">
                  <div className="flex items-center gap-1">
                    <span>{props.device.id}</span>
                  </div>
                </Chip>
              </div>
            </div>
            <p className="text-sm">
              This will allow the device to participate in the mining process.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="pt-3">
          <Button color="warning" onPress={cancel} disabled={loading}>
            Cancel
          </Button>
          <Button color="primary" isLoading={loading} onPress={register}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
