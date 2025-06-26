import { ProductDescription } from '@/ui/product-description'
import { formatEther } from '@hairy/ether-lib'

import { Else, If, Then } from '@hairy/react-lib'
import { formatNumeric, whenever } from '@hairy/utils'
import { Card, CardBody } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import { Divider } from 'antd'
import dayjs from 'dayjs'
import { useAsync } from 'react-use'

function Page() {
  const router = useRouter()
  const [price, setPrice] = useState<string>()

  const { value: detail, loading } = useAsync(
    async () => whenever(router.query.id, id => getProductId({ id: +id })),
    [router.query.id],
  )
  const { value: variations = [] } = useAsync(
    async () => whenever(detail?.id, id => getProductIdVariations({ id: +id })),
    [detail],
  )
  const { value: statistics } = useAsync(
    async () => whenever(detail?.id, id => getProductIdStatistics({ id })),
    [detail],
  )

  return (
    <layouts.default>
      <If cond={!loading} tag="section" className="flex flex-col gap-4 px-0 py-8 md:py-10">
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
                orders={detail?.orders}
                target={detail?.target}
                limit={detail?.limit}
                price={price || detail?.ether}
                ready={detail?.ready}
                name={detail?.name}
              />
              <ProductForm
                id={detail?.id}
                attributes={detail?.attributes}
                price={price || detail?.ether}
                variations={variations}
                onChange={variation => setPrice(variation?.ether)}
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold mt-6 mb-4">
            Cumulative statistics
          </h1>
          <Card className="shadow-none mb-2 bg-gray-100 bg-opacity-50 dark:bg-content1 dark:bg-opacity-50">
            <CardBody>
              <div className="flex max-md:flex-wrap gap-1 justify-between">
                <div className="flex flex-1 items-center flex-col gap-1">
                  <p className="text-lg">$ {formatEther(statistics?.totalValueSecured, { zeromove: false })}</p>
                  <h2 className="text-xl font-bold">Total Value Secured</h2>
                </div>
                <div className="max-md:hidden flex flex-col">
                  <Divider className="flex-1 mx-0" type="vertical" />
                </div>
                <div className="flex flex-1 items-center flex-col gap-1">
                  <p className="text-lg">$ {formatEther(statistics?.weeklyValueSecured, { zeromove: false })}</p>
                  <h2 className="text-xl font-bold">Weekly Value Secured</h2>
                </div>
                <div className="max-md:hidden flex flex-col">
                  <Divider className="flex-1 mx-0" type="vertical" />
                </div>
                <div className="flex flex-1 items-center flex-col gap-1">
                  <p className="text-lg">{formatNumeric(statistics?.activeStakes)}</p>
                  <h2 className="text-xl font-bold">Active Stakes</h2>
                </div>
                <div className="max-md:hidden flex flex-col">
                  <Divider className="flex-1 mx-0" type="vertical" />
                </div>
                <div className="flex flex-1 items-center flex-col gap-1">
                  <p className="text-lg">{formatNumeric(statistics?.totalParticipants)}</p>
                  <h2 className="text-xl font-bold">Total Participants</h2>
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="flex justify-end">
            <span className="text-default-500">Last updated: {dayjs().format('MMMM D, YYYY - h:mm A')}</span>
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
