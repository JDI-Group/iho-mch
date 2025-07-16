import type { Device } from '@/apis/index.type'
import type { PropsWithDetailedHTML } from '@hairy/react-lib'
import { variants } from '@/config'
import { fonts } from '@/config/fonts'
import { addToast, Image, Modal, ModalBody, ModalContent, ModalHeader, Progress } from '@heroui/react'
import { useExtendOverlay } from '@overlastic/react'
import { useMount } from 'react-use'
import { useAccount } from 'wagmi'

export interface MinerSearchDialogProps {
  data: Device
}

export function MinerSearchDialog(props: MinerSearchDialogProps) {
  const overlay = useExtendOverlay({ duration: 300 })
  const [value, setValue] = useState(0)
  const { address } = useAccount()

  useEffect(() => {
    const interval = setInterval(() => {
      const value = Math.floor(Math.random() * 5)
      setValue(v => (v >= 100 ? 100 : v + value))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  async function confirm() {
    try {
      const device = await getDeviceOrder({ order: props.data.order })

      if (device.owner.toLowerCase() !== address?.toLowerCase()) {
        addToast({ color: 'danger', description: 'You are not the owner of the device' })
        overlay.reject()
        return
      }

      if (device.product !== props.data.product) {
        addToast({ color: 'danger', description: 'Product category mismatch' })
        overlay.reject()
        return
      }

      Object.assign(device, { mac: generateMac() })
      overlay.resolve(device)
    }
    catch {
      overlay.reject()
    }
  }

  useMount(() => {
    setTimeout(confirm, 3000)
  })

  return (
    <Modal className={fonts.barlow.className} isOpen={overlay.visible} onOpenChange={overlay.reject}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2>Searching...</h2>
          <span className="text-sm">{props.data.name}</span>
        </ModalHeader>
        <ModalBody className="pb-20">
          <div className="flex flex-col items-center justify-center">
            <CircleRipples className="-mb-[23px]" />
            <Image width="60" src="/phone.png" />
            <div className="w-full mt-2 mb-1">
              <Progress value={value} size="sm" className="mx-16 w-auto" />
            </div>
            <span>Search device, please wait...</span>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

function CircleRipples(props: PropsWithDetailedHTML) {
  const roundClassName = 'absolute left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] m-auto bg-success-600 opacity-0 rounded-full'

  return (
    <div className={clsx('relative w-10 h-10', props.className)}>
      <motion.div className={roundClassName} custom={0} initial="hidden" animate="visible" variants={variants.diffuse(40)} />
      <motion.div className={roundClassName} custom={2} initial="hidden" animate="visible" variants={variants.diffuse(40)} />
      <motion.div className={roundClassName} custom={4} initial="hidden" animate="visible" variants={variants.diffuse(40)} />
      <motion.div className={roundClassName} custom={6} initial="hidden" animate="visible" variants={variants.diffuse(40)} />
    </div>
  )
}
