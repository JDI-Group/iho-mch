import { HomePage } from '@/ui/home-page'

function Page() {
  return (
    <layouts.default>
      <NonNotExitsConnect>
        <HomePage />
      </NonNotExitsConnect>
    </layouts.default>
  )
}

export default Page
