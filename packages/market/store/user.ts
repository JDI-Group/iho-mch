import { defineAsyncStore } from '@hairy/react-lib'

export const user = defineAsyncStore(
  async () => {
    const customer = await getUser()
    return {
      firstName: customer.first_name,
      lastName: customer.last_name,
      address: customer.billing?.address_1,
      region: customer.billing?.country || undefined,
      email: customer.billing?.email,
      phone: customer.billing?.phone,
    }
  },
  {
    initial: {
      firstName: '',
      lastName: '',
      address: '',
      region: undefined,
      email: '',
      phone: '',
    },
  },
)
