import { ProductDescription } from '@/ui/product-description'
import { Else, If, Then } from '@hairy/react-lib'

import { whenever } from '@hairy/utils'
import { Spinner } from '@heroui/spinner'
import { useAsync } from 'react-use'

function Page() {
  const router = useRouter()
  const { value: detail, loading } = useAsync(
    async () => whenever(router.query.id, id => getProductId({ id: +id })),
    [router.query.id],
  )
  const { value: variations = [] } = useAsync(
    async () => whenever(detail?.id, id => getProductIdVariations({ id: +id })),
    [detail],
  )
  const [price, setPrice] = useState<string>()

  return (
    <layouts.default>
      <If cond={!loading} tag="section" className="flex flex-col gap-4 px-0 md:px-8 py-8 md:py-10">
        <Then cond={detail} tag="div">
          <div className="flex flex-col md:flex-row gap-2 md:gap-14">
            <div className="flex-1 flex flex-col gap-2">
              <ProductImages
                name={detail?.name}
                images={detail?.images}
              />
            </div>
            <div className="flex flex-1 flex-col">
              <ProductDescription
                description={detail?.short_description}
                price={price || detail?.priceMXC}
                name={detail?.name}
              />
              <ProductForm
                id={detail?.id}
                attributes={detail?.attributes}
                variations={variations}
                onChange={variation => setPrice(variation?.priceMXC)}
              />
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
