import { getProductId } from '@/api'
import { useAsyncState, useWhenever } from '@hairy/react-lib'
import { whenever } from '@hairy/utils'

function Page() {
  const router = useRouter()

  const [{ value: _detail, loading: _loading }, fetch] = useAsyncState(
    async () => whenever(router.query.id, id => getProductId({ id: +id })),
    [router],
  )

  useWhenever(router.query.id, fetch)

  return (
    <layouts.default>

    </layouts.default>
  )
}

export default Page
