import type { Attribute, Variation } from '@/api/index.type'
import type { FormEvent } from 'react'
import { stake } from '@/services/stake'
import { If, useWatch } from '@hairy/react-lib'
import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Select, SelectItem } from '@heroui/select'
import { addToast } from '@heroui/toast'
import { useOverlayInject } from '@overlastic/react'

export interface ProductFormProps {
  id?: number
  attributes?: Attribute[]
  variations?: Variation[]
  onChange?: (variation?: Variation) => void
}

export function ProductForm(props: ProductFormProps) {
  const openSettingsDialog = useOverlayInject(SettingsDialog)
  const [data, setData] = useState<Record<string, any>>({})
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await stake({ product: props.id!, variation: variation!.id })
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
        <Button type="submit" className="w-full" color="primary" size="lg">
          STAKE NOW
        </Button>
      </Form>
    </>
  )
}
