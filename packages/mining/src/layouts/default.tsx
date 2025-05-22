import { fonts } from '../config/fonts'
import { Head } from './components/head'
import { Header } from './components/header'
import { Main } from './components/main'
import { Tabbar } from './components/tabbar'

export default function DefaultLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className={clsx('min-h-screen flex flex-col max-w-xl mx-auto', fonts.barlow.className)}>
      <Head />
      <Header />
      <Main children={children} />
      <Tabbar />
    </div>
  )
}
