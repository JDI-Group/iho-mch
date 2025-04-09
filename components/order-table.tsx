import type { Order } from '@/apis/index.typee'
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
      case 'actions':
        return (
          <Link className="cursor-pointer" onPress={() => detail?.(item)}>
            View
          </Link>
        )
      case 'total':
        return <span>${value}</span>
      default:
        return value
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table
        topContentPlacement="outside"
        bottomContentPlacement="outside"
        removeWrapper
        className="min-h-72"
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
