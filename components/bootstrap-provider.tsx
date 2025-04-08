import { FILE_PREFIX } from '@/config/constants'
import { Errors, idprefix, wait } from '@hairy/ether-lib'
import {
  useFetchRequestIntercept,
  useFetchResponseIntercept,
  useStore,
  useWhenever,
} from '@hairy/react-lib'

import { cloneDeepWith, Deferred, jsonTryParse, riposte } from '@hairy/utils'
import { addToast, closeAll } from '@heroui/toast'
import { useMount } from 'react-use'
import { useDisconnect } from 'wagmi'

function customizer(value: any) {
  if (typeof value === 'string'
    && value.startsWith(process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!)
    && value.includes(FILE_PREFIX)) {
    return `/api/files/${value.split(FILE_PREFIX)[1]}`
  }
}

export function BootstrapProvider(props: React.PropsWithChildren) {
  const authentication = useStore(store.authentication)
  const [, fetchUser, resetUser] = useStoreUser()
  const { disconnect } = useDisconnect()

  useFetchRequestIntercept((fetch, input, init) => {
    if (typeof input === 'string' && input?.startsWith(process.env.NEXT_PUBLIC_SERVER_URL!)) {
      const headers = Object.assign({ token: store.authentication.$state.token }, init?.headers)
      return fetch(input, { ...init, headers })
    }
    else {
      return fetch(input, init)
    }
  })

  useFetchResponseIntercept(async (response) => {
    const text = await response.clone().text()
    const data = jsonTryParse(text)
    if (data?.statusCode) {
      data.error && addToast({ color: 'danger', description: data.error })
      throw data
    }

    if (!data)
      return response
    const value = JSON.stringify(cloneDeepWith(data, customizer))
    return new Response(value, response)
  })

  useMount(() => {
    let deferred: Deferred<any> | undefined
    const messages: Record<string, string> = {
      Canceled: 'You have rejected the action Please approve it to proceed',
      [Errors.ACTION_REJECTED]: ('You have rejected the action Please approve it to proceed'),
      [Errors.NUMERIC_FAULT]: ('A numeric operation caused an overflow or underflow'),
      [Errors.CALL_EXCEPTION]: ('The contract encountered an exception'),
      [Errors.INSUFFICIENT_FUNDS]: ('You have insufficient funds to complete the transaction'),
      [Errors.NONCE_EXPIRED]: ('A transaction with the same nonce but a higher gas price was sent making this one obsolete'),
      [Errors.REPLACEMENT_UNDERPRICED]: ('This transaction was replaced by another one'),
    }

    const errors: Record<string, string> = {
      [idprefix('InvalidSignature()')]: ('Invalid signature'),
      [idprefix('TransferFailed()')]: ('Insufficient Claim Pool'),
      [idprefix('TransferUnauthorized()')]: ('Unauthorized Transfer'),
      [idprefix('InvalidAccount()')]: ('Insufficient account'),
    }

    wait.subscribe('before', () => {
      deferred = new Deferred()
      deferred.finally(closeAll)
      addToast({
        promise: deferred,
        description: 'Waiting for transaction confirmation',
        hideCloseButton: true,
      })
    })
    wait.subscribe('after', () => {
      deferred?.resolve(undefined)
      deferred = undefined
    })
    wait.subscribe('error', (error: any) => {
      const description = riposte(
        [!!errors[error?.data], errors[error?.data]],
        [!!messages[error.code], messages[error.code]],
        [true, `An unknown error occurred`],
      )
      addToast({ title: 'Transaction Error', description, color: 'danger' })
    })
  })

  useWhenever(authentication.token, fetchUser, { immediate: true })
  useWhenever(
    !authentication.token,
    () => {
      resetUser({
        firstName: '',
        lastName: '',
        address: '',
        region: undefined,
        email: '',
        phone: '',
      })
      disconnect()
    },
    { immediate: true },
  )

  return props.children
}
