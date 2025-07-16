import type { Device, Product } from '@/apis/index.type'
import type { PropsWithDetailedHTML } from '@hairy/react-lib'
import type { Hex } from 'viem'
import { variants } from '@/config'
import { Else, If, Then, useAsyncCallback, useWhenever } from '@hairy/react-lib'
import { delay } from '@hairy/utils'
import { addToast, Button, Card, CardBody, CardHeader, Divider, Navbar as HeroUINavbar, Image, Input, NavbarBrand, NavbarContent } from '@heroui/react'
import { useOverlayInject } from '@overlastic/react'
import { AnimatePresence } from 'framer-motion'
import { useAsync, useMount } from 'react-use'
import { useAccount } from 'wagmi'

function Page() {
  const [isTimeout, setIsTimeout] = useState<boolean>(false)
  useMount(resetTimeout)

  const { value: products = [] } = useAsync(() => getProduct())
  const { address } = useAccount()

  const openMinerSearchDialog = useOverlayInject<MinerSearchDialogProps, Device>(MinerSearchDialog)
  const openMinerConfirmDialog = useOverlayInject<MinerConfirmDialogProps, Hex>(MinerConfirmDialog)

  const [devices, setDevices] = useState<Device[]>([])
  const [product, setProduct] = useState<Product>()
  const [input, setInput] = useState('')
  const router = useRouter()

  const [loading, scan] = useAsyncCallback(async () => {
    resetTimeout()
    setDevices(await getDevice({ owner: address! }))
  })

  function resetTimeout() {
    setTimeout(() => setIsTimeout(true), 3000)
    setIsTimeout(false)
  }

  async function manually() {
    if (!input || !product)
      return

    const device = await openMinerSearchDialog({
      data: {
        ...product as any,
        product: product.id,
        order: +input,
        mac: '',
      },
    })
    await delay(300)
    await register(device)
  }

  async function register(device: Device) {
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

  useWhenever(address, scan)
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
            <div className="text-sm">Search account devices</div>
            <div className="text-tiny text-default-500">Searching in progress...</div>
          </CardHeader>
          <CardBody className="h-[237px]">
            <If cond={!loading && devices.length}>
              <Then tag="div" className="grid grid-cols-2 gap-4">
                <AnimatePresence>
                  {devices.map((device, index) => (
                    <motion.div
                      onClick={() => register({ ...device, mac: generateMac() })}
                      key={device.order}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 1.5, delay: index * 0.15 } }}
                      exit={{ opacity: 0 }}
                    >
                      <ScannerDeviceItem device={device} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Then>
              <Else tag="div" className="flex text-center px-12 flex-col justify-center items-center pt-8 pb-16">
                <CircleRipples className="-mb-[23px]" />
                <Image width="60" src="/phone.png" />
                <span className="text-default-700 text-xs">Please try to get as close as possible to the device you want to add</span>
                <If cond={isTimeout} tag="span" className="text-warning-500 text-tiny">
                  No device found, you can choose to add it from the list below
                  or <a className="text-blue-500" onClick={scan}>try again</a>
                </If>
              </Else>
            </If>
          </CardBody>
        </Card>
      </section>
      <section className="px-4 mb-4">
        <Card>
          <CardHeader className="flex-col items-start">
            <div className="text-sm">Manually adding devices</div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              {products.sort((a, b) => b.name.length - a.name.length).map(item => (
                <div key={item.id} onClick={() => setProduct(item)}>
                  <ScannerDeviceItem device={item} select={product?.id === item.id} />
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-6">
              <Input
                radius="sm"
                type="number"
                onChange={event => setInput(event.target.value)}
                value={input}
                className="flex-1"
                classNames={{ inputWrapper: 'min-h-9 h-9', innerWrapper: 'h-9' }}
                placeholder="Enter order number"
              />
              <Button radius="sm" className="h-9" color="primary" disabled={!product || !input} onPress={manually}>
                Confrim
              </Button>
            </div>
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
