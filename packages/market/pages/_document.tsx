import { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

React.useLayoutEffect = React.useEffect

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={clsx('min-h-screen bg-background antialiased')}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
