import type { PropsWithChildren } from 'react'

export function Main(props: PropsWithChildren) {
  return (
    <main>
      {props.children}
    </main>
  )
}
