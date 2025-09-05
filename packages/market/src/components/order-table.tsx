import type { Order } from '@/apis/index.type'
import { formatEther } from '@hairy/ether-lib'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { Spinner } from '@heroui/spinner'
import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'

export interface OrderTableProps {
  detail?: (order: Order) => void
  loading?: boolean
  next?: () => void
  more?: boolean
  data?: Order[]
}

export function OrderTable(props: OrderTableProps) {
  const { data, next, more, detail, loading } = props

  function renderCell(key: string | number, item: Order) {
    const value = getKeyValue(item, key)
    switch (key) {
      case 'product':
        return (
          <div className="truncate max-w-44">
            {item?.line_items.map(item => item.name).join(', ')}
          </div>
        )
      case 'actions':
        return (
          <Link className="cursor-pointer" onPress={() => detail?.(item)}>
            View
          </Link>
        )
      case 'date_modified':
        return formatDate(value)
      case 'total':
        return (<span>{formatEther(item?.ether)} MCH</span>)
      case 'tracking':
        // eslint-disable-next-line no-case-declarations
        const [tracking] = parseOrderTracking(item.line_items)
        if (!tracking)
          return '-'
        return <Link href={tracking.url} target="_blank">View Tracking</Link>
      default:
        return value
    }
  }

  return (
    <div className="w-full">
      <Table
        isHeaderSticky
        topContentPlacement="outside"
        bottomContentPlacement="outside"
        removeWrapper
        className="min-h-72"
        classNames={{
          base: 'max-h-[520px] pr-2 overflow-scroll overflow-x-auto',
        }}
        bottomContent={
          more && !loading && (
            <div className="flex w-full justify-center">
              <Button isDisabled={loading} variant="flat" onPress={next}>
                {loading && <Spinner color="white" size="sm" />}
                Load More
              </Button>
            </div>
          )
        }
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn key="id">ORDER</TableColumn>
          <TableColumn maxWidth={180} key="product">PRODUCT</TableColumn>
          <TableColumn minWidth={180} key="date_modified">DATE</TableColumn>
          <TableColumn key="status">STATUS</TableColumn>
          <TableColumn key="total">TOTAL</TableColumn>
          <TableColumn key="tracking">TRACKING</TableColumn>
          <TableColumn key="actions">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={loading}
          items={data}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent="No rows to display."
        >
          {item => (
            <TableRow key={item.id}>
              {key => <TableCell>{renderCell(key, item)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
