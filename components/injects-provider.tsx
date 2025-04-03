import type { ThemeConfig } from 'antd'
import { wagmiConfig } from '@/config/wagmi'

import { Injector, useStore, useWatch } from '@hairy/react-lib'
import { SubscribeWagmiConfig } from '@harsta/client/wagmi'
import { HeroUIProvider } from '@heroui/system'
import { ToastProvider } from '@heroui/toast'
import { OverlaysProvider } from '@overlastic/react'
import {
  createAuthenticationAdapter,
  darkTheme as rainbowDarkTheme,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { theme as antdTheme, ConfigProvider as AntdUIProvider } from 'antd'
import { useTheme } from 'next-themes'
import { WagmiProvider } from 'wagmi'

const themes = {
  antd: {
    dark: {
      algorithm: antdTheme.darkAlgorithm,
      token: { colorPrimary: '#234F9B' },
      components: {
        Steps: {
          descriptionMaxWidth: 280,
          navArrowColor: '#234F9B',
          dotSize: 10,
          fontSize: 16,
          colorPrimary: 'rgba(255, 255, 255, 0.6)',
        },
      },
    } as ThemeConfig,
    light: {
      algorithm: antdTheme.defaultAlgorithm,
      token: { colorPrimary: '#234F9B' },
      components: {
        Steps: {
          descriptionMaxWidth: 280,
          navArrowColor: '#234F9B',
          dotSize: 10,
          fontSize: 16,
          colorPrimary: 'rgba(0, 0, 0, 0.6)',
        },
      },
    } as ThemeConfig,
  },
  rainbow: {
    dark: rainbowDarkTheme({ accentColor: '#006fee' }),
    light: rainbowLightTheme(),
  },
}

const adapter = createAuthenticationAdapter(store.authentication.$actions)

export function InjectsProvider(props: React.PropsWithChildren) {
  const authentication = useStore(store.authentication)
  const client = new QueryClient()
  const router = useRouter()
  const { theme } = useTheme()
  const [rainbowTheme, setRainbowTheme] = useState(themes.rainbow.dark)
  const [antdTheme, setAntdTheme] = useState(themes.antd.dark)
  // fix rainbow theme based on the current theme
  useWatch(theme, () => {
    theme === 'dark'
      ? setRainbowTheme(themes.rainbow.dark)
      : setRainbowTheme(themes.rainbow.light)
    theme === 'dark'
      ? setAntdTheme(themes.antd.dark)
      : setAntdTheme(themes.antd.light)
  }, { immediate: true })

  return (
    <Injector
      install={[
        { component: WagmiProvider, props: { config: wagmiConfig } },
        { component: QueryClientProvider, props: { client } },
        { component: RainbowKitAuthenticationProvider, props: { adapter, status: authentication.status } },
        { component: RainbowKitProvider, props: { theme: rainbowTheme } },
        { component: AntdUIProvider, props: { theme: antdTheme } },
        { component: HeroUIProvider, props: { navigate: router.push } },
        { component: OverlaysProvider },
      ]}
    >
      <ToastProvider placement="top-center" />
      <SubscribeWagmiConfig />
      {props.children}
    </Injector>
  )
}
