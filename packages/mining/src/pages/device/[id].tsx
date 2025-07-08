import { If } from '@hairy/react-lib'

function Page() {
  const router = useRouter()
  return (
    <layouts.default>
      <If cond={router.query.id}>
        <DetailPage />
      </If>
    </layouts.default>
  )
}

export default Page
