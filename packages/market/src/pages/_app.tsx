import type { AppProps } from 'next/app'
import { BootstrapProvider } from '@/src/components/bootstrap-provider'
import { InjectsProvider } from '@/src/components/injects-provider'
import { Injector } from '@hairy/react-lib'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextThemesProvider defaultTheme="dark">
      <Injector install={[InjectsProvider, BootstrapProvider]}>
        <Component {...pageProps} />
      </Injector>
    </NextThemesProvider>
  )
}
