import { Card, CardBody } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'

export function HomeMiningIncrease() {
  const router = useRouter()

  return (
    <div onClick={() => router.push('/scanner')}>
      <Card className="border-none w-[100px] h-[100px]" radius="lg">
        <CardBody className="flex justify-center items-center">
          <Icon fontSize="28" icon="ri:add-line" />
        </CardBody>
      </Card>
    </div>
  )
}
