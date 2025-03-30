import { getProduct } from '@/api'
import { subtitle } from '@/components/primitives'
import DefaultLayout from '@/layouts/default'
import { Else, If, Then } from '@hairy/react-lib'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Image } from '@heroui/image'
import { Spinner } from '@heroui/spinner'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useAsync } from 'react-use'

export default function Page() {
  const { value: products = [], loading } = useAsync(
    () => getProduct(),
  )
  const router = useRouter()
  return (
    <DefaultLayout>
      <section>
        <div className="h-14 md:h-8 mb-6">
          <AnimatePresence initial={false}>
            {loading
              ? (
                  <motion.h1
                    key="a"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.37 } }}
                    exit={{ opacity: 0 }}

                    className={subtitle()}
                  >
                    <span className="mr-2 text-default-800">Store.</span>
                    <span className="text-default-500">The best way to get the FREE products you love.</span>
                  </motion.h1>
                )
              : (
                  <motion.h1
                    key="b"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.37 } }}
                    exit={{ opacity: 0 }}
                    className={subtitle()}
                  >
                    <span className="mr-2 text-default-800">The latest.</span>
                    <span className="text-default-500">Take a look at what’s new, right now.</span>
                  </motion.h1>
                )}
          </AnimatePresence>
        </div>
        <If cond={!loading}>
          <Then>
            <div className="flex">
              {products.map(product => (
                <div key={product.id} onClick={() => router.push(`/products/${product.id}`)} className="w-full md:w-[294px]">
                  <Card className="w-full py-4 cursor-pointer">
                    <CardHeader className="pb-0 pt-0 px-4 flex-col items-start">
                      <h4 className="font-bold text-large">{product.name}</h4>
                      <p className="text-[8px] bg-gradient-to-r from-[#0079D0] via-[#9E52D8] via-[#DA365C] to-[#D04901] bg-clip-text text-transparent uppercase font-bold">
                        Virtual Reality Reimagined
                      </p>
                      <small className="text-default-500">{product.description}</small>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                      <Image
                        width="100%"
                        height={177}
                        alt="Card background"
                        className="object-cover bg-black rounded-xl"
                        src={product.images[0].src}
                      />
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          </Then>
          <Else>
            <div className="w-full h-[50vh] flex justify-center items-center">
              <Spinner />
            </div>
          </Else>
        </If>
      </section>
    </DefaultLayout>
  )
}
