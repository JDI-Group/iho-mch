import type { AppProps } from 'next/app'
import { BootstrapProvider } from '@/components/bootstrap-provider'
import { InjectsProvider } from '@/components/injects-provider'
import { Injector, useWatch } from '@hairy/react-lib'
import { pageviewCount } from '@waline/client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function App({ Component, pageProps, router }: AppProps) {
  useWatch(
    router.asPath,
    () => pageviewCount({ serverURL: 'waline-swart-eta.vercel.app', path: window.location.pathname }),
    { immediate: true },
  )
  return (
    <NextThemesProvider defaultTheme="dark">
      <Injector install={[InjectsProvider, BootstrapProvider]}>
        <Component {...pageProps} />
      </Injector>
    </NextThemesProvider>
  )
}
