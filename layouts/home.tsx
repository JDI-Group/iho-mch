import type { PropsWithDetailedHTML } from '@hairy/react-lib'
import { fonts } from '@/config/fonts'
import { Footer } from './components/footer'
import { Head } from './components/head'
import { Navbar } from './components/navbar'

export default function HomeLayout({ children, className }: PropsWithDetailedHTML<React.PropsWithChildren>) {
  return (
    <div className={clsx('relative flex flex-col h-screen', className, fonts.barlow.className)}>
      <Head />
      <Navbar className="absolute bg-transparent backdrop-filter-none" />
      {/* TODO transition with linear-gradient */}
      <div className="relative">
        <div className="bg-light dark:bg-dark h-[100vh] w-full absolute top-0" />
        <main>
          {children}
        </main>
        <Footer className={container()} />
      </div>
    </div>
  )
}
