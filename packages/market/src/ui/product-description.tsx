import { formatEther } from '@hairy/ether-lib'
import { Else, If, Then, useAsyncState, useStore } from '@hairy/react-lib'
import { cover, redirectTo, riposte, whenever } from '@hairy/utils'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Link } from '@heroui/link'
import { useWindowSize } from 'react-use'
import { Swiper, SwiperSlide } from 'swiper/react'

export interface ProductDescriptionProps {
  description?: string
  product?: number
}

export function ProductDescription({ description, product }: ProductDescriptionProps) {
  const config = useStore(store.config)

  const [{ value: stats = [] }] = useAsyncState(
    () => getStatsProduct({ product: product! }),
    [],
    { immediate: true },
  )
  const isLasted = config.batch === Number(process.env.NEXT_PUBLIC_MARKET_BATCH)

  function isLastedThis(batch: number) {
    return isLasted && batch === config.batch
  }
  function getAddress(batch: number) {
    return Reflect.get(addresses, `IHOLockVaultV${batch}`)[chain.id]
  }

  function onToExplorer(batch: number) {
    const address = getAddress(batch)
    const url = `${chain.blockExplorers.default.url}/address/${address}`
    redirectTo(url, '_blank')
  }
  const { width } = useWindowSize()
  return (
    <div className="my-6">
      {/* <h2 className="text-2xl font-bold mt-6 mb-4">Product Description</h2> */}
      <Swiper
        className="mb-6"
        spaceBetween={20}
        slidesPerView={width < 640 ? 1 : width < 768 ? 2 : 3.5}
      >
        {stats.map(item => (
          <SwiperSlide key={item.batch}>
            <Card>
              <CardHeader className="pt-4 pb-2 flex flex-col items-start">
                <div className="w-full items-center flex justify-between">
                  <div className="flex gap-2">
                    Batch #{item.batch}
                  </div>
                  <Chip
                    size="sm"
                    className="font-bold"
                    variant="flat"
                    color={riposte(
                      [!item.status, 'default'],
                      [isLastedThis(item.batch), 'success'],
                      [item.status === 'starting', 'success'],
                      [item.status === 'ending-soon', 'warning'],
                      [item.status === 'completed', 'primary'],
                    )}
                  >
                    {riposte(
                      [!item.status, 'Not participating'],
                      [isLastedThis(item.batch), 'In progress'],
                      [true, item.status],
                    )}
                  </Chip>
                </div>
                <div>
                  Started {item.start}
                </div>
                <div>
                  <Link className="text-default-500 hover:cursor-pointer border-b" onClick={() => onToExplorer(item.batch)}>
                    {cover(getAddress(item.batch), [6, 5, 6])}
                  </Link>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex items-end justify-between">
                  <div>Total Value Secured:</div>
                  <div className="font-bold text-lg">
                    {whenever(item?.totalValueSecuredMXC, () => `${formatEther(item?.totalValueSecuredMXC)} MXC`) || '-'}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>Participant:</div>
                  <div className="font-bold text-lg">
                    <If cond={item.status}>
                      <Then>
                        <If cond={item.status === 'ended'}>
                          <Then tag="span">
                            {item.orders} / {item.orders}
                          </Then>
                          <Else tag="span">
                            {item.orders} / {item.target}
                          </Else>
                        </If>
                      </Then>
                      <Else tag="span">-</Else>
                    </If>
                  </div>
                </div>
              </CardBody>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
      <div dangerouslySetInnerHTML={{ __html: description || '' }} />
    </div>
  )
}
