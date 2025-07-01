import { variants } from '@/config/variants'
import { If } from '@hairy/react-lib'
import { Accordion, AccordionItem } from '@heroui/accordion'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { Steps } from 'antd'
import { AnimatePresence } from 'framer-motion'
import { useAsync, useWindowScroll } from 'react-use'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

const accordions = [
  {
    value: 'item-1',
    question: 'What is moonchain IHO?',
    answer: 'Moonchain Initial Hardware Offering (IHO) is a revolutionary mining concept combining cutting-edge hardware with your own decentralized wallet. We\'re offering mining hardware at no cost—just choose your desired Hardware, lock your Moonchain and start mining. It\'s never been easier or more rewarding to mine. Don\'t miss out—join the future of mining today!',
  },
  {
    value: 'item-2',
    question: 'How do I lock moonchain to get my free hardware?',
    answer: `Simply visit <a href="https://iho.moonchain.com/">iho.moonchain.com</a> choose your desired mining Hardware, lock the corresponding amount of Moonchain for the lock period and fill out the order form. Simple!`,
  },
  {
    value: 'item-3',
    question: 'Why would you give away free mining hardware?',
    answer: 'We\'re giving away free mining hardware because we believe the crypto mining industry is overdue for a revolution. Mining must be transparent, decentralized, and accessible to all. By removing barriers and offering hardware for free, we’re empowering more people to join the mining revolution, accelerating the global adoption of Moonchain and blockchain technology. This is your chance to be part of something transformative—join the revolution now!',
  },
  {
    value: 'item-4',
    question: 'How should I choose the right hardware for me?',
    answer: 'Choose hardware that aligns with your needs and lifestyle. Whether you\'re looking for a wearable device to track and boost your activity levels or prefer a more stationary setup, it\'s essential to also consider mining efficiency, lock amounts, and electricity usage. Make sure your hardware is optimized for both performance and sustainability to maximize your returns. The right choice today can lead to significant rewards tomorrow—hardware is strictly limited, don’t miss out!',
  },
  {
    value: 'item-5',
    question: 'How do the locks work on my wallet?',
    answer: 'Moonchain locks are securely stored in your wallet, ensuring peace of mind. We leverage Ethereum smart contracts, which are fully auditable and transparent. We invite everyone to review the contracts themselves—rest assured, they do exactly what they promise. At Moonchain, transparency is our foundation, and we stand by it fully. Don\'t miss the opportunity to be part of a fully transparent ecosystem.',
  },
  {
    value: 'item-6',
    question: 'What is the lock-in period if I lock Moonchain to receive free hardware, and can I withdraw my tokens during this time?',
    answer: 'When you lock your Moonchain tokens to receive free mining hardware, your tokens are subject to a 1-year lock-in period. During this 1-year period, you cannot withdraw or transfer your locked tokens for any reason. This lock is required as part of the agreement for receiving the free hardware. After the 1-year period ends, your tokens will become available for withdrawal or transfer as usual.',
  },
  {
    value: 'item-7',
    question: 'How can Moonchain give away free mining hardware? How is this sustainable?',
    answer: 'Our goal is to rapidly expand the global reach  of the Moonchain network. We do this by making it easy for anyone, anywhere, to participate as a node operator. By giving away free Web3 hardware, we help spread nodes quickly across the globe, making our network more decentralized, secure, and robust. This strategy welcomes both Web2 and Web3 users, demonstrating the value of Blockchain to the world via everyday devices. Moonchain IHO significantly increases network transactions and activity, whilst helping create a vibrant and proactive Moonchain community.\n\nAdditionally, our venture capital (VC) partners are investing directly in these 3rd party hardware companies that manufacture this new-age Web3 Hardware. This creates a closed-loop business model—as the network grows and demand for hardware increases, our partners and ecosystem benefit together. This approach aligns incentives, sustains growth, and ensures the long-term success of both the Moonchain network and its supporting infrastructure.',
  },
  {
    value: 'item-8',
    question: 'Where is my stake stored when I stake my Moonchain for free hardware?',
    answer: 'Your staked Moonchain tokens are always stored in your own wallet and secured by a verifiable Ethereum smart contract. This smart contract manages the stake and unstaking processes, ensuring your tokens remain safe, tamper-proof and always on your wallet! Moonchain believes in transparency, therefore everything is fully on-chain and transparent, so you can verify the contract and your stake at any time you wish. You always keep control of your wallet and your tokens are never held by a third party, that\'s the Moonchain commitment to you!',
  },
  {
    value: 'item-9',
    question: 'How many tokens do you expect to earn by IHO mining?',
    answer: `With IHO mining on Moonchain, you're mining zkEVM $MXC tokens. The number of tokens you can earn depends on how much $MXC you stake on your hardware. The more $MXC you stake, the more you will mine with your device. Your rewards scale with your staking amount, so maximizing your stake can increase your mining output.`,
  },
  {
    value: 'item-10',
    question: 'What are the token release rules?',
    answer: `Since the IHO provides you with hardware for free, your $MXC tokens will be locked for 12 months. There is no option for early release—the tokens will only become available after the 12-month locking period.`,
  },
]

export default function IndexPage() {
  const router = useRouter()
  const scroll = useWindowScroll()

  const { value: stats = [] } = useAsync(
    () => getStats(),
  )

  function onNavigateProducts() {
    router.push('/products')
  }

  function onExploreIHO() {
    window.scrollTo({
      top: document.body.clientHeight,
      behavior: 'smooth',
    })
  }

  return (
    <layouts.home>
      <motion.section
        className={container({ className: 'hidden md:block w-full h-screen relative' })}
        variants={variants.fadeOpacity}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="mx-auto container flex h-full justify-center gap-[100px] items-center">
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

              <Button className="font-bold tracking-[0.1rem]" onPress={onExploreIHO} radius="full" variant="ghost">
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
        <If cond={scroll.y < 50} tag={AnimatePresence}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full flex justify-center bottom-6"
          >
            <Link onPress={onExploreIHO} className="cursor-pointer text-default-500" color="foreground">
              <span className="mr-2">Explore Moonchain IHO</span>
              <MaterialSymbolsArrowCoolDownRounded />
            </Link>
          </motion.div>
        </If>
      </motion.section>
      <motion.section
        variants={variants.fadeOpacity}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={container({ className: 'md:hidden min-h-screen flex flex-col' })}
      >
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
          <Button className="font-bold min-w-48 tracking-[0.1rem]" onPress={onExploreIHO} radius="full" variant="ghost">
            LEARN MORE
          </Button>
        </div>
      </motion.section>

      <motion.section
        className={container({ className: 'w-full min-h-screen py-12 md:py-4 relative flex flex-col justify-center items-center text-defa' })}
        variants={variants.fadeOpacity}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="hidden sm:block w-full">
          <Swiper
            spaceBetween={50}
            style={{ '--swiper-navigation-color': 'var(--heroui-default)' } as any}
            modules={[Navigation]}
            navigation
          >
            {stats.map(item => (
              <SwiperSlide key={item.batch} className="w-full">
                <HomeStatsBatchItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="block sm:hidden w-full">
          <Swiper
            spaceBetween={20}
            slidesPerView={1.1}
          >
            {stats.map(batch => (
              batch.stats.map(item => (
                <SwiperSlide key={item.name}>
                  <HomeStatsItem item={item} batch={batch.batch} start={batch.start} />
                </SwiperSlide>
              ))
            ))}
          </Swiper>
        </div>
      </motion.section>

      <section className="flex w-full justify-center items-center lg:flex-row lg:justify-between flex-col gap-8 lg:gap-12 py-12 min-h-[30vh] lg:h-[80vh] font-bold relative">
        <motion.div
          className={container({ className: 'relative z-10 w-full flex justify-center items-center py-4' })}
          variants={variants.fadeOpacity}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="overflow-x-auto pb-2">
            <Steps
              direction="horizontal"
              current={3}
              progressDot
              items={[
                {
                  title: 'SELECT',
                  description: 'Select the mining hardware you want for free',
                },
                {
                  title: 'STAKE',
                  description: 'Stake your Moonchain on your own wallet',
                },
                {
                  title: 'MINE',
                  description: 'Your mining hardware is delivered FREE, connect & start mining!',
                },
              ]}
            />
          </div>
        </motion.div>
        <video style={{ maskImage: 'linear-gradient(to bottom, transparent, black 50%, transparent)' }} className="hidden dark:block absolute top-0 left-0 w-full h-full object-cover opacity-80" autoPlay loop muted preload="auto" playsInline>
          <source src="https://thegraph.com/_next/static/media/footer.04cca2ee.mp4" type="video/mp4" />
          <source src="/_next/static/media/footer.1c85069a.webm" type="video/webm"></source>
        </video>
      </section>

      <section className={container({ className: 'relative z-10 pb-[20vh]' })}>
        <motion.div variants={variants.fadeOpacity} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8">
          <div className={title({ size: 'sm' })}>
            FAQs
          </div>
        </motion.div>
        <motion.div variants={variants.fadeOpacity} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Accordion>
            {accordions.map(item => (
              <AccordionItem key={item.value} aria-label={item.value} title={item.question}>
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: item.answer }} />
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

    </layouts.home>
  )
}
