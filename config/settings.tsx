export const settings = [
  {
    key: 'address',
    title: 'Address',
    child: () => <FormShipping />,
    width: '5xl',
  },
  {
    key: 'orders',
    title: 'Orders',
    child: () => <OrderPreview />,
    width: '5xl',
  },
] as const
