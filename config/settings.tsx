import { FormShipping } from '@/components/form-shipping'
import { OrdersPreview } from '@/components/orders-preview'

export const settings = [
  {
    title: 'Address',
    child: () => <FormShipping />,
  },
  {
    title: 'Orders',
    child: () => <OrdersPreview />,
  },
] as const
