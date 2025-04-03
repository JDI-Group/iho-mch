import { FormShipping } from '@/components/form-shipping'
import { OrdersPreview } from '@/components/orders-preview'

export const settings = [
  {
    key: 'address',
    title: 'Address',
    child: () => <FormShipping />,
    width: 'lg',
  },
  {
    key: 'orders',
    title: 'Orders',
    child: () => <OrdersPreview />,
    width: '2xl',
  },
] as const
