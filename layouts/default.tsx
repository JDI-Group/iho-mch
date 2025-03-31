import { Footer } from './components/footer'
import { Head } from './components/head'
import { Navbar } from './components/navbar'

export default function DefaultLayout({ children }: React.PropsWithChildren) {
  return (
    <div
      className={clsx('relative flex flex-col h-screen font-merriweather')}
    >
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-4">
        {children}
      </main>
      <Footer />
    </div>
  )
}
