import type { Order } from '@/apis/index.type'
import { useAsyncCallbacks } from '@/hooks/use-async-callbacks'
import { helperStake } from '@/services/stake'
import { formatEther } from '@hairy/ether-lib'
import { Case, If, Switch } from '@hairy/react-lib'
import { cover } from '@hairy/utils'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/divider'
import { Link } from '@heroui/link'
import { useOverlayInject } from '@overlastic/react'
import { Timeline } from 'antd'
import dayjs from 'dayjs'

export interface OrderDetailProps {
  detail?: Order
  back?: (value?: any) => void
  onChange?: (status: Order) => void
}

export function OrderDetail(props: OrderDetailProps) {
  const openCancelConfirmDialog = useOverlayInject(CancelConfirmDialog)
  const openDeleteConfirmDialog = useOverlayInject(DeleteConfirmDialog)
  const [status, actions] = useAsyncCallbacks({
    stake: async () => {
      const receipt = await helperStake({ order: props.detail!.id })
      if (receipt)
        props.onChange?.({ ...props.detail!, hash: receipt?.hash })
    },
    cancel: async () => {
      await openCancelConfirmDialog()
      await putOrderCancel({ order: props.detail!.id })
      props.onChange?.({ ...props.detail!, status: 'cancelled' })
    },
    delete: async () => {
      await openDeleteConfirmDialog()
      await deleteOrderId({ id: props.detail!.id })
      props.onChange?.({ ...props.detail!, status: 'deleted' })
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
        <If cond={props.detail?.hash}>
          <div className="flex justify-between">
            <div className="font-bold">Transaction Hash:</div>
            <Link href={`${chain.blockExplorers.default.url}/tx/${props.detail?.hash}`}>
              {props.detail?.hash}
            </Link>
          </div>
        </If>
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
          <div>
            <span>{formatEther(props.detail?.ether)} MXC</span>
            <span className="mx-2">/</span>
            <span>${props.detail?.total}</span>
          </div>
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
            <Button className={clsx({ '!opacity-50': status.loading || !!props.detail?.hash })} disabled={status.loading || !!props.detail?.hash} isLoading={status.loadings.cancel} onPress={actions.cancel}>
              Cancel
            </Button>
            <Button disabled={status.loading} isLoading={status.loadings.stake || !!props.detail?.hash} color="primary" onPress={actions.stake}>
              {props.detail?.hash ? 'Confirming' : 'Stake'}
            </Button>
          </Case>
          <Case cond="cancelled">
            <Button disabled={status.loading} isLoading={status.loadings.delete} color="warning" onPress={actions.delete}>
              Delete
            </Button>
          </Case>
        </Switch>
      </CardFooter>
    </Card>
  )
}
