import type { SVGProps } from 'react'
import { Button, Card, CardBody, CardFooter, Image } from '@heroui/react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

function Page() {
  return (
    <layouts.default>
      <section className="px-4 mb-4">
        <Card className="border-none">
          <section className="flex justify-between">
            <div className="flex flex-col justify-between gap-y-2 p-4">
              <div className="flex flex-col gap-y-4"><dt className="text-sm font-medium text-default-600">Todays' Revenue</dt>
                <dd className="flex items-end font-semibold text-default-700">
                  <span className="text-2xl mr-2">1,234.56</span>
                  <dd className="text-base">MXC</dd>
                </dd>
              </div>
              <div className="mt-2 flex items-center gap-x-1 text-xs font-medium text-success-500">
                <Up className="text-base" />
                <span>3.3%</span>
                <span className="text-default-400 dark:text-default-500"> vs yesterday</span>
              </div>
            </div>
            <div className="mt-10 min-h-24 w-36 min-w-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={300}
                  height={300}
                  data={data}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="natural" dataKey="pv" stroke="#8884d8" fill="url(#colorUv)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <Button isIconOnly variant="light" size="sm" className="absolute right-2 top-2 w-auto rounded-full">
              <Omit className="text-default-500" />
            </Button>
          </section>
        </Card>
      </section>
      <section className="px-4 mb-4">
        <div className="my-4">
          Your Devices
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,100px)] gap-4">
          <DeviceItem src="https://heroui.com/images/hero-card.jpeg" />
          <DeviceItem src="https://heroui.com/images/album-cover.png" />
          <DeviceItem src="https://heroui.com/images/hero-card.jpeg" />
          <DeviceItem src="https://heroui.com/images/album-cover.png" />
          <DeviceAdd />
        </div>
      </section>

    </layouts.default>
  )
}

function DeviceItem(props: { src: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Card isFooterBlurred className="border-none" radius="lg">
        <Image
          alt="Woman listing to music"
          className="object-cover"
          height={100}
          src={props.src}
          width={100}
        />
        <CardFooter className=" before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 text-tiny text-white truncate px-0">
          <div className="flex justify-between items-center w-full px-2">
            <span>ID.0xcdef</span>
            <Dot />
          </div>
        </CardFooter>
      </Card>
      <div className="flex justify-center items-center gap-2 text-tiny px-1">
        Headset Plus
      </div>
    </div>
  )
}

function DeviceAdd() {
  return (
    <Card className="border-none w-[100px] h-[100px]" radius="lg">
      <CardBody className="flex justify-center items-center">
        <PajamasPlus className="text-2xl" />
      </CardBody>
    </Card>
  )
}

function Dot() {
  return (
    <div className="w-2 h-2 bg-green-500 rounded-full" />
  )
}

function PajamasPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" {...props}>{/* Icon from Gitlab SVGs by GitLab B.V. - https://gitlab.com/gitlab-org/gitlab-svgs/-/blob/main/LICENSE */}<path fill="currentColor" fillRule="evenodd" d="M8.75 2.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5z" clipRule="evenodd"></path></svg>
  )
}

function Up(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6m0 0H9m9 0v9"></path></svg>
  )
}
function Omit(props: SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"></path></svg>
}

export default Page
