import type { Attribute, Variation } from '@/apis/index.type'
import type { FormEvent } from 'react'
import { helperStake } from '@/services/stake'
import { If, useAsyncCallback, useStore, useWatch } from '@hairy/react-lib'
import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Select, SelectItem } from '@heroui/select'
import { addToast, closeAll } from '@heroui/toast'
import { useOverlayInject } from '@overlastic/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export interface ProductFormProps {
  id?: number
  attributes?: Attribute[]
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
      await helperStake({
        product: props.id!,
        variation: variation!.id,
      })
      addToast({
        title: 'Success',
        description: 'Staked successfully',
        color: 'success',
        endContent: (
          <Button
            color="primary"
            onPress={() => openSettingsDialog({ target: 'orders' })}
          >
            View
          </Button>
        ),
      })
    }
    catch (error: any) {
      if (error.code === 'ACTION_REJECTED') {
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
    }
  })

  async function verifyShippingAddress(address?: string) {
    if (!address) {
      addToast({
        description: 'Delivery address not filled in, please complete the delivery address first',
        endContent: (
          <Button
            isIconOnly
            size="sm"
            color="default"
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
          className="w-full"
          color="primary"
          size="lg"
        >
          STAKE NOW
        </Button>

      </Form>
    </>
  )
}
