import { Accordion, AccordionItem } from '@heroui/accordion'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'

const accordions = [
  {
    value: 'item-1',
    question: 'What is moonchain IHO?',
    answer: 'Moonchain Initial Hardware Offering (IHO) is a revolutionary mining concept combining cutting-edge hardware with your own decentralized wallet. We\'re offering mining hardware at no cost—just choose your desired Hardware, lock your Moonchain and start mining. It\'s never been easier or more rewarding to mine. Don\'t miss out—join the future of mining today!',
  },
  {
    value: 'item-2',
    question: 'How do i lock moonchain to get my free hardware?',
    answer: `Simply visit <a href="https://iho.moonchain.com/">iho.moonchain.com</a> choose your desired mining Hardware, lock the corresponding amount of Moonchain for the lock period and fill out the order form. Simple!`,
  },
  {
    value: 'item-3',
    question: 'Why would you give away free mining hardware?',
    answer: 'We\'re giving away free mining hardware because we believe the crypto mining industry is overdue for a revolution. Mining must be transparent, decentralized, and accessible to all. By removing barriers and offering hardware for free, we’re empowering more people to join the mining revolution, accelerating the global adoption of Moonchain and blockchain technology. This is your chance to be part of something transformative—join the revolution now!',
  },
  {
    value: 'item-4',
    question: 'How should i choose the right hardware for me?',
    answer: 'Choose hardware that aligns with your needs and lifestyle. Whether you\'re looking for a wearable device to track and boost your activity levels or prefer a more stationary setup, it\'s essential to also consider mining efficiency, lock amounts, and electricity usage. Make sure your hardware is optimized for both performance and sustainability to maximize your returns. The right choice today can lead to significant rewards tomorrow—hardware is strictly limited, don’t miss out!',
  },
  {
    value: 'item-5',
    question: 'How do the locks work on my wallet?',
    answer: 'Moonchain locks are securely stored in your wallet, ensuring peace of mind. We leverage Ethereum smart contracts, which are fully auditable and transparent. We invite everyone to review the contracts themselves—rest assured, they do exactly what they promise. At Moonchain, transparency is our foundation, and we stand by it fully. Don\'t miss the opportunity to be part of a fully transparent ecosystem.',
  },
]

export default function IndexPage() {
  const router = useRouter()

  function onNavigateProducts() {
    router.push('/products')
  }
  return (
    <layouts.home>
      <section className="hidden md:block w-full h-screen">
        <div className=" flex h-full justify-center gap-[100px] items-center">
          <div className="flex-1 flex flex-col items-center relative z-10 gap-8 text-center">
            <div className="text-3xl lg:text-5xl font-bold">
              INITIAL HARDWARE OFFERING (IHO)
            </div>
            <div className="text-xl lg:text-3xl">
              The Future of Hardware Mining is FREE!
            </div>
            <div className="text-2xl lg:text-3xl flex gap-2 items-center">
              <span>SELECT</span>
              <div className="h-px bg-black dark:bg-white w-10" />
              <span>STAKE</span>
              <div className="h-px bg-black dark:bg-white w-10" />
              <span>MINE</span>
            </div>
            <div className="flex gap-4 lg:gap-8">
              <Button className="font-bold tracking-[0.1rem]" onPress={onNavigateProducts} radius="full" color="primary">
                GET FREE
              </Button>
              <Button className="font-bold tracking-[0.1rem]" radius="full" variant="ghost">
                LEARN MORE
              </Button>
            </div>
          </div>
          <div className={clsx([
            'hidden md:block w-full h-screen',
            'lg:relative lg:max-w-[544px] lg:min-w-[300px]',
            'md:absolute md:opacity-80 md:blur-[0.8px] dark:md:opacity-50',
            'lg:opacity-100 lg:blur-0 dark:lg:opacity-100',
          ])}
          >
            <HomeFloatProjects />
          </div>
        </div>
      </section>

      <section className="md:hidden min-h-screen flex flex-col">
        <div className="pt-16 relative z-30 mt-6 text-center flex flex-col gap-4 mb-12">
          <div className="flex flex-col justify-center items-center text-3xl font-bold">
            INITIAL HARDWARE OFFERING (IHO)
          </div>
          <div className="text-xl">
            The Future of Hardware Mining is FREE!
          </div>
          <div className="text-2xl flex gap-4 justify-center">
            <span className="border-b-2">SELECT</span>
            <span className="border-b-2">STAKE</span>
            <span className="border-b-2">MINE</span>
          </div>
        </div>
        <div className="-mt-[24px] mb-4">
          <HomeFloatProjectsUnline />
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button className="font-bold min-w-48 tracking-[0.1rem]" onPress={onNavigateProducts} radius="full" color="primary">
            GET FREE
          </Button>
          <Button className="font-bold min-w-48 tracking-[0.1rem]" radius="full" variant="ghost">
            LEARN MORE
          </Button>
        </div>
      </section>

      <section className="flex w-full justify-center lg:justify-between flex-col lg:flex-row items-center gap-8 lg:gap-12 py-12 lg:h-screen font-bold">
        <Card className="w-full lg:flex-1 lg:h-[200px] h-[180px]">
          <CardBody className="h-full px-6 flex flex-col items-center justify-center gap-4 text-center">
            <div className="text-2xl">SELECT</div>
            <div>Select the mining hardware you want for free</div>
          </CardBody>
        </Card>
        <Card className="w-full lg:flex-1 lg:h-[200px] h-[180px]">
          <CardBody className="h-full px-6 flex flex-col items-center justify-center gap-4 text-center">
            <div className="text-2xl">STAKE</div>
            <div>Stake your Moonchain on your own wallet</div>
          </CardBody>
        </Card>
        <Card className="w-full lg:flex-1 lg:h-[200px] h-[180px]">
          <CardBody className="h-full px-6 flex flex-col items-center justify-center gap-4 text-center">
            <div className="text-2xl">MINE</div>
            <div>Your mining hardware is delivered FREE, connect & start mining!</div>
          </CardBody>
        </Card>
      </section>

      <section className="relative z-10">
        <div className="mb-8">
          <div className={title({ size: 'sm' })}>
            FAQs
          </div>
        </div>
        <Accordion>
          {accordions.map(item => (
            <AccordionItem key={item.value} aria-label={item.value} title={item.question}>
              <div className="text-sm" dangerouslySetInnerHTML={{ __html: item.answer }} />
            </AccordionItem>
          ))}
        </Accordion>
      </section>

    </layouts.home>
  )
}
