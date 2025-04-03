import { fonts } from '@/config/fonts'
import { Footer } from './components/footer'
import { Head } from './components/head'
import { Navbar } from './components/navbar'

export default function DefaultLayout({ children }: React.PropsWithChildren) {
  return (
    <div className={clsx('relative flex flex-col h-screen', fonts.barlow.className)}>
      <Head />
      <Navbar />
      <main className={container({ className: 'pt-4' })}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
