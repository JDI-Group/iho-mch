import type { AppProps } from 'next/app'
import { BootstrapProvider } from '@/components/bootstrap-provider'
import { InjectsProvider } from '@/components/injects-provider'
import { Injector } from '@hairy/react-lib'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Injector install={[
      { component: NextThemesProvider, props: { defaultTheme: 'dark' } },
      InjectsProvider,
      BootstrapProvider,
    ]}
    >
      <Component {...pageProps} />
    </Injector>
  )
}
