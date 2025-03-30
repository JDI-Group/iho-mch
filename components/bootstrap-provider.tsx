import type { PropsWithChildren } from 'react'
import { FILE_PREFIX } from '@/config/constants'

import { useStoreUser } from '@/hooks/use-store-user'

import store from '@/store'
import {
  useFetchRequestIntercept,
  useFetchResponseIntercept,
  useStore,
  useWhenever,
} from '@hairy/react-lib'
import { cloneDeepWith, jsonTryParse } from '@hairy/utils'

function customizer(value: any) {
  if (typeof value === 'string' && value.includes(FILE_PREFIX))
    return `/api/files/${value.split(FILE_PREFIX)[1]}`
}

export function BootstrapProvider(props: PropsWithChildren) {
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
    if (response.url.endsWith('/product')) {
      return new Response(cloneDeepWith(data, customizer), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    }
    return response
  })

  useWhenever(authentication.token, fetchUser, { immediate: true })

  return (
    props.children
  )
}
