import { fonts } from '@/config/fonts'
import { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

React.useLayoutEffect = React.useEffect

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fonts.sans.variable,
          fonts.barlow.variable,
          fonts.merriweather.variable,
          fonts.mono.variable,
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
