import type { Attribute, Variation } from '@/api/index.type'
import type { FormEvent } from 'react'
import { If, useWatch } from '@hairy/react-lib'
import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Select, SelectItem } from '@heroui/select'

export interface ProductFormProps {
  id?: number
  attributes?: Attribute[]
  variations?: Variation[]
  onChange?: (variation?: Variation) => void
}

export function ProductForm(props: ProductFormProps) {
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

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent default browser page refresh.
    event.preventDefault()
    // Get form data as an object.
    Object.fromEntries(new FormData(event.currentTarget))
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
