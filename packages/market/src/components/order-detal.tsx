import type { Order } from '@/apis/index.type'
import { useAsyncCallbacks } from '@/hooks/use-async-callbacks'
import { helperStake } from '@/services/stake'
import { Case, If, Switch } from '@hairy/react-lib'
import { cover } from '@hairy/utils'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/divider'
import { Link } from '@heroui/link'
import { Timeline } from 'antd'
import dayjs from 'dayjs'

export interface OrderDetailProps {
  detail?: Order
  back?: (value?: any) => void
  onChange?: (status: string) => void
}

export function OrderDetail(props: OrderDetailProps) {
  const [status, actions] = useAsyncCallbacks({
    stake: async () => {
      await helperStake({ order: props.detail!.id })
      props.onChange?.('processing')
    },
    cancel: async () => {
      await putOrderCancel({ order: props.detail!.id })
      props.onChange?.('cancelled')
    },
  })

  const tracking = useMemo(() => parseOrderTracking(props.detail?.line_items), [props.detail?.line_items])

  return (
    <Card shadow="none">
      <CardHeader className="w-full pt-0 flex justify-between">
        <span className="text-base">
          <span>Order </span>
          <span className="text-warning">
            #{props.detail?.id}
          </span>
          <span> was placed on </span>
          <span className="text-warning">
            {formatDate(props.detail?.date_created)}
          </span>
          <span> and is currently </span>
          <span className="text-warning">
            {props.detail?.status}
          </span>
          <span>.</span>
        </span>
        <Link className="flex items-center gap-1 cursor-pointer" onPress={props.back}>
          <span>Back</span>
          <MaterialSymbolsArrowForwardIosRounded className="mt-[2px]" />
        </Link>
      </CardHeader>
      <Divider />
      <CardBody className="flex-col gap-4">
        <div className="flex justify-between">
          <div className="font-bold">Receiving address:</div>
          <span>
            {[
              props.detail?.shipping.address_1,
              props.detail?.shipping.address_2,
              props.detail?.shipping.first_name,
              props.detail?.shipping.last_name,
              props.detail?.shipping.phone,
              props.detail?.shipping.email,
              props.detail?.shipping.postcode,
            ].join(' ')}
          </span>
        </div>
        <div className="flex justify-between">
          <div className="font-bold">Products</div>
          <div className="ml-2">
            {props.detail?.line_items.map(item => (<div key={item.id}>{item.name}</div>))}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold">Total</div>
          <div>${props.detail?.total}</div>
        </div>
        <If cond={tracking.length}>
          <div className="flex justify-between">
            <div className="font-bold">Tracking information:</div>
            <div className="flex-1 ml-2">
              <Timeline
                mode="right"
                items={tracking.map((item) => {
                  return {
                    children: (
                      <div className="inline-flex flex-col items-end" key={item.tracking_number}>
                        <span>Carrier - {item.carrier_name}</span>
                        <span className="text-default-500">
                          {dayjs.unix(item.time).format('YYYY/MM/DD HH:mm:ss')}
                        </span>
                        <Link className="text-sm" href={item.url} target="_blank">
                          #{cover(item.tracking_number, [4, 4, 4])}
                        </Link>
                      </div>
                    ),
                  }
                })}
              />
            </div>
          </div>
        </If>
      </CardBody>
      <CardFooter className="flex gap-3 justify-end">
        <Switch value={props.detail?.status}>
          <Case cond="pending">
            <Button disabled={status.loading} isLoading={status.loadings.cancel} onPress={actions.cancel}>
              Cancel
            </Button>
            <Button disabled={status.loading} isLoading={status.loadings.stake} color="primary" onPress={actions.stake}>
              Stake
            </Button>
          </Case>
        </Switch>
      </CardFooter>
    </Card>
  )
}
