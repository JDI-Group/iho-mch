import type { ThemeConfig } from 'antd'
import {
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import { theme as antdTheme } from 'antd'

export const themes = {
  antd: {
    dark: <ThemeConfig>{
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
    },
    light: <ThemeConfig>{
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
    },
  },
  rainbow: {
    dark: rainbowDarkTheme({ accentColor: '#006fee' }),
    light: rainbowLightTheme(),
  },
}
