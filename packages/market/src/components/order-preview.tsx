import type { Order } from '@/apis/index.type'
import { getOrder } from '@/apis'
import { Else, If, Then, useAsyncCallback } from '@hairy/react-lib'
import { useMount } from 'react-use'

export function OrderPreview() {
  const page = useRef(0)
  const [more, setMore] = useState(true)
  const [list, setList] = useState<Order[]>([])
  const [order, setOrder] = useState<Order>()

  const [loading, next] = useAsyncCallback(
    async () => {
      const list = await getOrder({ page: page.current += 1 })
      setList(prev => [...prev, ...list])
      list.length < 10 && setMore(false)
    },
  )

  function onChangeOrder(status: string) {
    if (status === 'deleted') {
      setList(prev => prev.filter(item => item.id !== order?.id))
      setOrder(undefined)
      return
    }
    setList(prev => prev.map((item) => {
      item.id === order?.id && (item.status = status)
      return item
    }))
  }

  function back() {
    setOrder(undefined)
  }

  useMount(next)

  return (
    <If cond={!order}>
      <Then tag="div">
        <OrderTable
          data={list}
          next={next}
          more={more}
          loading={loading}
          detail={setOrder}
        />
      </Then>
      <Else tag="div">
        <OrderDetail
          detail={order}
          back={back}
          onChange={onChangeOrder}
        />
      </Else>
    </If>
  )
}
