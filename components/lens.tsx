import type { PropsWithDetailedHTML } from '@hairy/react-lib'
import type { MouseEvent } from 'react'
import { If } from '@hairy/react-lib'

export interface LensProps {
  children?: React.ReactNode
  zoom?: number
  size?: number
}
export function Lens(props: PropsWithDetailedHTML & LensProps) {
  const { zoom = 1.5, size = 170, children } = props
  const [hovering, setHovering] = useState(false)
  const [position, setPosition] = useState({ x: 100, y: 100 })

  function onMouseMove(event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect()
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }
  const mask = useMemo(
    () => `circle ${size! / 2}px at ${position.x}px ${position.y}px`,
    [position, size],
  )
  const origin = useMemo(
    () => `${position.x}px ${position.y}px`,
    [position],
  )

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={onMouseMove}
      className={clsx('relative z-20', props.className)}
      {...props}
    >
      {children}
      <If
        tag={motion.div}
        cond={hovering}
        initial={{ opacity: 0, scale: 0.58 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="absolute inset-0 overflow-hidden"
        style={{
          maskImage: `radial-gradient(${mask}, black 100%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(${mask}, black 100%, transparent 100%)`,
          transformOrigin: origin,
        }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: `scale(${zoom})`, transformOrigin: origin }}
        >
          {children}
        </div>
      </If>
    </div>
  )
}
