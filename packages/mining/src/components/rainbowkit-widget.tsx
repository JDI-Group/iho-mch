import type { SVGProps } from 'react'
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'

export interface RainbowkitWidgetProps {
  balance?: string
}

export function RainbowkitWidget() {
  return (
    <RainbowConnectButton.Custom>
      {() => {
        return (
          <RainbowConnectButton chainStatus={{ smallScreen: 'none' }} />
        )
      }}
    </RainbowConnectButton.Custom>
  )
}

export function MaterialSymbolsArrowDownwardAltRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}<path fill="currentColor" d="M11 14.2V6q0-.425.288-.712T12 5t.713.288T13 6v8.2l2.9-2.9q.275-.275.7-.275t.7.275t.275.7t-.275.7l-4.6 4.6q-.3.3-.7.3t-.7-.3l-4.6-4.6q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275z"></path></svg>
  )
}
