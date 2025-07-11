import { If } from '@hairy/react-lib'

function Page() {
  const router = useRouter()
  return (
    <layouts.default>
      <If cond={router.query.address}>
        <DetailPage />
      </If>
    </layouts.default>
  )
}

export default Page
