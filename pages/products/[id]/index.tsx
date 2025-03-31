import { removeInnerHTMLAttributes } from '@/utils'
import { Else, If, Then } from '@hairy/react-lib'
import { whenever } from '@hairy/utils'
import { Button } from '@heroui/button'
import { Image } from '@heroui/image'
import { Progress } from '@heroui/progress'
import { Select, SelectItem } from '@heroui/select'
import { Spinner } from '@heroui/spinner'
import { useOverlayInject } from '@overlastic/react'
import { useAsync } from 'react-use'

function Page() {
  const router = useRouter()

  const openProductDetailDialog = useOverlayInject(ProductDetailDialog)
  const { value: detail, loading } = useAsync(
    async () => whenever(router.query.id, id => getProductId({ id: +id })),
    [router.query.id],
  )

  const html = removeInnerHTMLAttributes(detail?.short_description || '', 'class')

  const [selects, setSelects] = useState<Record<string, any>>({})
  const attributes = useMemo(
    () => {
      const attributes = detail?.attributes.filter(attribute => attribute.variation) || []
      const variations = detail?.variations || []
      return attributes.map((attribute) => {
        const options = attribute.options.map((option, index) => {
          return {
            value: variations[index],
            label: option,
          }
        })
        return { ...attribute, options }
      })
    },
    [detail],
  )

  return (
    <layouts.default>
      <If cond={!loading} tag="section" className="flex flex-col gap-4 px-0 md:px-8 py-8 md:py-10">
        <Then tag="div">
          <div className="flex flex-col md:flex-row gap-2 md:gap-14">
            <h1 className={title({ size: 'sm', className: 'md:hidden mb-4' })}>
              {detail?.name}
            </h1>
            <div className="flex-1 flex flex-col gap-2">
              <Image className="border border-default-50" src={detail?.images[0].src} />
              <div className="flex gap-2">
                {detail?.images.map((image, index) => (
                  <Image
                    key={index}
                    className="p-0"
                    src={image.src}
                    width={100}
                    height={100}
                    alt="Card background"
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <h1 className={title({ size: 'sm', className: 'hidden md:inline-block mb-4' })}>
                {detail?.name}
              </h1>
              <p className="mb-2 bg-tag bg-clip-text text-transparent uppercase font-bold">
                Virtual Reality Reimagined
              </p>
              <p className="mb-4">
                <span>Get it</span>
                <span className="font-bold"> FREE </span>
                <span>by staking 200,000 Moonchain Tokens</span>
              </p>

              <div className="flex-1 min-h-40 relative mb-4 bg-default-100 bg-opacity-40 rounded-lg overflow-hidden">
                <div
                  className={clsx(
                    'absolute z-10 inset-0 opacity-0 bg-black bg-opacity-45 dark:bg-opacity-70 cursor-pointer',
                    'hover:opacity-100 transition-all duration-300 ease-in-out',
                    'flex items-center justify-center gap-2 text-white dark:text-default-600',
                  )}
                  onClick={() => openProductDetailDialog({ detail: detail! })}
                >
                  <div>Read More</div>
                  <ScreenFullIcon width={18} height={18} />
                </div>
                <div className="absolute inset-0 overflow-hidden m-4">
                  <div
                    className="text-sm space-y-2 mb-4 flex-1 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </div>
              </div>

              <div>Delivery Progress</div>
              <div className="flex items-center gap-2">
                <Progress className="flex-1" value={60} />
                <CarIcon size={32} />
              </div>
              <div className="-mt-2 mb-8 text-default-500 text-sm">
                89 more orders needed for dispatch
              </div>
              <div className="mb-8 text-default-500 text-sm">
                *Limit: 1 item per wallet
              </div>

              <If cond={attributes.length} tag="div" className="mb-8">
                {attributes.map(attribute => (
                  <Select
                    onChange={event => setSelects({ ...selects, [attribute.id]: event.target.value })}
                    value={selects[attribute.id]}
                    label={attribute.name}
                    key={attribute.id}
                    className="max-w-xs"
                    size="sm"
                  >
                    {attribute.options.map(option => (
                      <SelectItem key={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                ),
                )}
              </If>
              <Button color="primary" size="lg">
                STAKE NOW
              </Button>

            </div>
          </div>

        </Then>
        <Else tag="div" className="w-full h-[50vh] flex justify-center items-center">
          <Spinner />
        </Else>
      </If>
    </layouts.default>
  )
}

export default Page
