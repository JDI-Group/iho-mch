import { FILE_PREFIX } from '@/config/constants'

import { useStoreUser } from '@/hooks/use-store-user'

import {
  useFetchRequestIntercept,
  useFetchResponseIntercept,
  useStore,
  useWhenever,
} from '@hairy/react-lib'
import { cloneDeepWith, jsonTryParse } from '@hairy/utils'

function customizer(value: any) {
  if (typeof value === 'string'
    && value.startsWith(process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!)
    && value.includes(FILE_PREFIX)) {
    return `/api/files/${value.split(FILE_PREFIX)[1]}`
  }
}

export function BootstrapProvider(props: React.PropsWithChildren) {
  const authentication = useStore(store.authentication)
  const fetchUser = useStoreUser()[1]

  useFetchRequestIntercept((fetch, input, init) => {
    const headers = Object.assign({ token: authentication.token }, init?.headers)
    return fetch(input, { ...init, headers })
  })

  useFetchResponseIntercept(async (response) => {
    const text = await response.clone().text()
    const data = jsonTryParse(text)
    if (data?.statusCode)
      throw data
    if (!data)
      return response
    const value = JSON.stringify(cloneDeepWith(data, customizer))
    return new Response(value, response)
  })

  useWhenever(authentication.token, fetchUser, { immediate: true })

  return (
    props.children
  )
}
