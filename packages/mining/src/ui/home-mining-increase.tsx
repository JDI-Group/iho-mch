import type { SVGProps } from 'react'
import { Card, CardBody } from '@heroui/react'

export function HomeMiningIncrease() {
  return (
    <Card className="border-none w-[100px] h-[100px]" radius="lg">
      <CardBody className="flex justify-center items-center">
        <PajamasPlus className="text-2xl" />
      </CardBody>
    </Card>
  )
}

function PajamasPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" {...props as any}>{/* Icon from Gitlab SVGs by GitLab B.V. - https://gitlab.com/gitlab-org/gitlab-svgs/-/blob/main/LICENSE */}<path fill="currentColor" fillRule="evenodd" d="M8.75 2.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5z" clipRule="evenodd"></path></svg>
  )
}
