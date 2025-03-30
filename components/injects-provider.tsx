import { wagmiConfig } from '@/config/wagmi'
import { Injector, useStore, useWatch } from '@hairy/react-lib'

import { HeroUIProvider } from '@heroui/system'
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
    },
    light: {
      algorithm: antdTheme.defaultAlgorithm,
      token: { colorPrimary: '#234F9B' },
    },
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

  // fix rainbow theme based on the current theme
  useWatch(theme, () => {
    theme === 'dark'
      ? setRainbowTheme(themes.rainbow.dark)
      : setRainbowTheme(themes.rainbow.light)
  }, { immediate: true })

  return (
    <Injector
      install={[
        { component: WagmiProvider, props: { config: wagmiConfig } },
        { component: QueryClientProvider, props: { client } },
        { component: RainbowKitAuthenticationProvider, props: { adapter, status: authentication.status } },
        { component: RainbowKitProvider, props: { theme: rainbowTheme } },
        { component: AntdUIProvider, props: { theme: theme === 'dark' ? themes.antd.dark : themes.antd.light } },
        { component: HeroUIProvider, props: { navigate: router.push } },
        { component: OverlaysProvider },
      ]}
    >
      {props.children}
    </Injector>
  )
}
