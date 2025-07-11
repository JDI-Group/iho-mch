import type { Product } from '@/apis/index.type'
import type { MinerConfirmDialogProps } from '@/components/miner-confirm-dialog'
import type { MinerScanningDialogProps } from '@/components/miner-scanning-dialog'
import type { DeviceMetadata } from '@/types'
import type { PropsWithDetailedHTML } from '@hairy/react-lib'
import type { Hex } from 'viem'
import { variants } from '@/config'
import { If } from '@hairy/react-lib'
import { delay } from '@hairy/utils'
import { addToast, Card, CardBody, CardHeader, Divider, Navbar as HeroUINavbar, Image, NavbarBrand, NavbarContent } from '@heroui/react'
import { useOverlayInject } from '@overlastic/react'
import { useAsync, useMount } from 'react-use'

function Page() {
  const [isTimeout, setIsTimeout] = useState<boolean>(false)
  useMount(() => setTimeout(() => setIsTimeout(true), 3000))
  const { value: products = [] } = useAsync(() => getProduct())

  const openMinerScanningDialog = useOverlayInject<MinerScanningDialogProps, DeviceMetadata>(MinerScanningDialog)
  const openMinerConfirmDialog = useOverlayInject<MinerConfirmDialogProps, Hex>(MinerConfirmDialog)

  const router = useRouter()

  async function scan() {
    const _device = await navigator.bluetooth.requestDevice({
      filters: [
        { namePrefix: 'Xbox Wireless' },
        { namePrefix: 'EasySMX-M15' },
      ],
    })
  }

  async function manually(product: Product) {
    const device = await openMinerScanningDialog({ product })
    await delay(300)
    await register(device)
  }

  async function register(device: DeviceMetadata) {
    const hash = await openMinerConfirmDialog({ device })
    await transactionWaitingReceipt(hash)
    addToast({
      title: 'Device registered successfully',
      size: 'sm',
      description: <span className="text-sm">Your device {device.name} has been registered.</span>,
      color: 'success',
      shouldShowTimeoutProgress: true,
      timeout: 3000,
    })
  }

  useMount(scan)
  return (
    <layouts.default header={false}>
      <HeroUINavbar className="mb-6">
        <NavbarContent>
          <NavbarBrand className="gap-3 max-w-fit">
            <Icon onClick={() => router.back()} fontSize="24" icon="solar:arrow-left-broken" />
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="center">
          Add Device
        </NavbarContent>
        <NavbarContent justify="end">
          <Tooltip
            popoverTargetAction="toggle"
            content={(
              <div className="flex flex-col gap-2 p-2">
                <h4>What if the device to be added cannot be scanned?</h4>
                <Divider className="my-2" />
                <p>This may be due to poor network conditions or the device being bound to another user.</p>

                <p>1. Please ensure that the device is close enough to the router and that there is no strong interference in the surrounding network.</p>

                <p>2. Colleagues need to confirm that the device is turned on and in a discoverable state.</p>
              </div>
            )}
          >
            <Icon fontSize="18" icon="solar:question-circle-broken" />
          </Tooltip>
        </NavbarContent>
      </HeroUINavbar>
      <section className="px-4 mb-4">
        <Card>
          <CardHeader className="pb-0 flex-col items-start">
            <div className="text-sm">Scan nearby devices</div>
            <div className="text-tiny text-default-500">Scanning in progress...</div>
          </CardHeader>
          <CardBody>
            <div className="flex text-center px-12 flex-col justify-center items-center pt-8 pb-16">
              <CircleRipples className="-mb-[23px]" />
              <Image width="60" src="/phone.png" />
              <span className="text-default-700 text-xs">Please try to get as close as possible to the device you want to add</span>
              <If cond={isTimeout} tag="span" className="text-warning-500 text-tiny">
                No device found, you can choose to add it from the list below
                or <a className="text-blue-500" onClick={scan}>try again</a>
              </If>
            </div>
          </CardBody>
        </Card>
      </section>
      <section className="px-4 mb-4">
        <Card>
          <CardHeader className="flex-col items-start">
            <div className="text-sm">Manually adding devices</div>
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-4">
            {products.sort((a, b) => b.name.length - a.name.length).map(product => (
              <div key={product.id} onClick={() => manually(product)}>
                <Card className="shadow-none border">
                  <CardBody>
                    <div className="flex gap-2">
                      <Image className="h-8 rounded-md" src={product.images[0].src} />
                      <span className="flex-1 flex items-center justify-end min-w-0 text-sm truncate">{product.name}</span>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </CardBody>
        </Card>
      </section>
    </layouts.default>
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
export default Page
