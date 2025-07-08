import { If } from '@hairy/react-lib'
import { fonts } from '../config/fonts'
import { Head } from './components/head'
import { Header } from './components/header'
import { Main } from './components/main'
import { Tabbar } from './components/tabbar'

export default function DefaultLayout({ children, header }: { children?: React.ReactNode, header?: boolean }) {
  return (
    <div className={clsx('min-h-screen flex flex-col max-w-xl mx-auto', fonts.barlow.className)}>
      <Head />
      <If cond={header !== false}>
        <Header />
      </If>
      <Main children={children} />
      <Tabbar />
    </div>
  )
}
