import type { Attribute, Variation } from '@/apis/index.type'
import type { FormEvent } from 'react'
import { helperStake } from '@/services/stake'
import { If, useAsyncCallback, useStore, useWatch } from '@hairy/react-lib'
import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Link } from '@heroui/link'
import { Select, SelectItem } from '@heroui/select'
import { addToast, closeAll } from '@heroui/toast'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useOverlayInject } from '@overlastic/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export interface ProductFormProps {
  id?: number
  attributes?: Attribute[]
  upcoming?: boolean
  price?: string
  variations?: Variation[]
  onChange?: (variation?: Variation) => void
}

export function ProductForm(props: ProductFormProps) {
  const openSettingsDialog = useOverlayInject(SettingsDialog)
  const { openConnectModal } = useConnectModal()
  const [data, setData] = useState<Record<string, any>>({})
  const account = useAccount()
  const authentication = useStore(store.authentication)
  const { isConnecting } = useAccount()
  const { value: user } = useStore(store.user)

  const isConnected = account.isConnected
    && authentication.token
    && authentication.status === 'authenticated'
    && !isConnecting

  const attributes = useMemo(
    () => {
      const attributes = props.attributes?.filter(attribute => attribute.variation) || []
      return attributes.map(attribute => ({ ...attribute, slug: attribute.slug.toLowerCase() }))
    },
    [props.attributes],
  )
  const variation = useMemo(
    () => {
      return props.variations?.find((variation) => {
        for (const attribute of variation.attributes) {
          if (typeof data[attribute.slug] === 'undefined')
            return false
          if (data[attribute.slug] !== attribute.option)
            return false
        }
        return true
      })
    },
    [data, props.variations],
  )

  useWatch(variation, value => props.onChange?.(value))

  const [loading, onSubmit] = useAsyncCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await verifyAccountConnect()
    await verifyShippingAddress(user?.address)
    await verifyInsufficientFunds(props.price!)

    try {
      try {
        await helperStake({ product: props.id!, variation: variation?.id })
      }
      catch (error: any) {
        if (error.message === 'Order limit reached') {
          addToast({
            color: 'danger',
            classNames: { description: 'me-0' },
            description: 'You have reached the order limit and you have an unpaid order. Please pay it to continue.',
            endContent: (
              <Button
                isIconOnly
                size="sm"
                className="w-[24px] h-[24px]"
                color="danger"
                onPress={() => {
                  openSettingsDialog({ target: 'orders' })
                  closeAll()
                }}
              >
                <MaterialSymbolsArrowForwardIosRounded />
              </Button>
            ),
          })
        }

        throw error
      }

      addToast({
        title: 'Transaction Successful',
        description: (
          <div className="flex flex-col gap-2">
            <span>Your transaction has been successfully sent and confirmed.</span>
            <Link className="text-tiny inline-flex gap-1" onPress={() => openSettingsDialog({ target: 'orders' })}>
              <span>View Order Detail</span>
              <Icon className="text-sm" icon="solar:round-arrow-right-up-broken" />
            </Link>
          </div>
        ),
      })
    }
    catch (error: any) {
      if (error.code === 'ACTION_REJECTED')
        catchActionRejection()
    }
  })

  async function verifyShippingAddress(address?: string) {
    if (!address) {
      addToast({
        classNames: { description: 'me-0' },
        description: 'Delivery address not filled in, please complete the delivery address first',
        endContent: (
          <Button
            isIconOnly
            size="sm"
            color="default"
            className="w-[24px] h-[24px]"
            onPress={() => {
              openSettingsDialog({ target: 'address' })
              closeAll()
            }}
          >
            <MaterialSymbolsArrowForwardIosRounded />
          </Button>
        ),
      })
      throw new Error('Delivery address not filled in')
    }
  }

  async function verifyAccountConnect() {
    if (!isConnected) {
      openConnectModal?.()
      throw new Error('Please connect your wallet first')
    }
  }

  async function catchActionRejection() {
    addToast({
      description: 'Created an order but did not proceed to the next step. Please redo the operation on the order page',
      color: 'warning',
      endContent: (
        <Button
          isIconOnly
          size="sm"
          color="warning"
          onPress={() => {
            openSettingsDialog({ target: 'orders' })
            closeAll()
          }}
        >
          <MaterialSymbolsArrowForwardIosRounded />
        </Button>
      ),
    })
  }

  return (
    <>
      <Form className="w-full" onSubmit={onSubmit}>
        <If cond={attributes.length} tag="div" className="w-full space-y-4 mb-8">
          {attributes.map(attribute => (
            <Select
              label={attribute.name}
              key={attribute.id}
              name={attribute.slug}
              isRequired
              value={data[attribute.slug]}
              onChange={event => setData({ ...data, [attribute.slug]: event.target.value })}
              className="max-w-xs"
              size="sm"
            >
              {attribute.options.map(option => (
                <SelectItem key={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
          ))}
        </If>
        <Button
          isLoading={loading}
          type="submit"
          className={clsx('w-full', props.upcoming ? '!opacity-50 cursor-not-allowed' : '')}
          color="primary"
          size="lg"
          disabled={props.upcoming}
        >
          {props.upcoming ? 'Coming Soon' : 'Stake Now'}
        </Button>
      </Form>
    </>
  )
}
