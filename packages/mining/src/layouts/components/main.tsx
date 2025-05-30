import type { PropsWithChildren } from 'react'

export function Main(props: PropsWithChildren) {
  return (
    <main className="flex-1 flex flex-col">
      {props.children as any}
    </main>
  )
}
