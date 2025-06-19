import { Else, If, Then } from '@hairy/react-lib'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Image } from '@heroui/image'
import { Spinner } from '@heroui/spinner'
import { AnimatePresence } from 'framer-motion'
import { useAsync } from 'react-use'

export default function Page() {
  const { value: products = [], loading } = useAsync(
    () => getProduct(),
  )
  const router = useRouter()
  return (
    <layouts.default>
      <section>
        <div className="h-14 md:h-8 mb-6">
          <If cond={loading} tag={AnimatePresence} initial={false}>
            <Then
              key="title-loading"
              tag={motion.h1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.37 } }}
              exit={{ opacity: 0 }}
              className={subtitle()}
            >
              <span className="mr-2 text-default-800">Store.</span>
              <span className="text-default-500">The best way to get the FREE products you love.</span>
            </Then>
            <Else
              key="title-loaded"
              tag={motion.h1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.37 } }}
              exit={{ opacity: 0 }}
              className={subtitle()}
            >
              <span className="mr-2 text-default-800">The latest.</span>
              <span className="text-default-500">Take a look at what’s new, right now.</span>
            </Else>
          </If>
        </div>
        <If cond={!loading}>
          <Then tag="div" className="flex flex-wrap gap-4">
            {products.map(product => (
              <div key={product.id} onClick={() => router.push(`/products/${product.id}`)} className="w-full md:w-[294px]">
                <Card className="w-full py-4 cursor-pointer">
                  <CardHeader className="pb-0 pt-0 px-4 flex-col items-start">
                    <h4 className="font-bold text-large w-full">
                      <div className="truncate">{product.name}</div>
                    </h4>
                    <p className="text-[8px] bg-tag bg-clip-text text-transparent uppercase font-bold">
                      Virtual Reality Reimagined
                    </p>
                    <If cond={product.ready}>
                      <p className="text-green-500 text-[10px]">
                        Immediate Delivery
                      </p>
                    </If>
                    <div className="min-h-14">
                      <small className="text-default-500 line-clamp-3">{product.description}</small>
                    </div>
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
          </Then>
          <Else tag="div" className="w-full h-[50vh] flex justify-center items-center">
            <Spinner />
          </Else>
        </If>
      </section>
    </layouts.default>
  )
}
