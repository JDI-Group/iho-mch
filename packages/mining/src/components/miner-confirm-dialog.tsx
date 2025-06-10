import { fonts } from '@/config/fonts'
import { Button, Chip, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { useExtendOverlay } from '@overlastic/react'

export interface MinerConfirmDialogProps {
  device: BluetoothDevice
}

export function MinerConfirmDialog(props: MinerConfirmDialogProps) {
  const overlay = useExtendOverlay({ duration: 300 })

  return (
    <Modal className={fonts.barlow.className} isOpen={overlay.visible} onOpenChange={overlay.reject}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Confirm Your Device
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-sm">
              Do you want to register the following device？
            </p>
            <div className="flex gap-2">
              <Image
                alt="Woman listing to music"
                className="object-cover"
                height={80}
                src="https://heroui.com/images/hero-card.jpeg"
                width={80}
              />
              <div className="flex flex-col">
                <div className="text-sm mb-2 mt-1 font-bold">{props.device.name || 'Unknown Device'}</div>
                <div className="flex gap-1 mb-1">
                  <Chip size="sm" className="h-[18px] text-tiny">Headset</Chip>
                  <Chip size="sm" className="h-[18px] text-tiny">Virtual</Chip>
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
        <ModalFooter>
          <Button color="warning" onPress={overlay.reject}>
            Cancel
          </Button>
          <Button color="primary" onPress={overlay.resolve}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
