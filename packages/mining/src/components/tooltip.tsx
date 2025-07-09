import type { TooltipProps as HeroTooltipProps } from '@heroui/react'
import { Tooltip as HeroTooltip } from '@heroui/react'

export interface TooltipProps extends HeroTooltipProps {

}
export function Tooltip(props: TooltipProps) {
  const [openTooltip, setOpenTooltip] = useState<boolean>(false)
  const tooltipContentRef = useRef<any>(null)
  useOutsideClick(tooltipContentRef, () => setOpenTooltip(false))
  return (
    <HeroTooltip {...props} isOpen={openTooltip}>
      <div className="inline-flex" ref={tooltipContentRef} onClick={() => setOpenTooltip(!openTooltip)}>
        {props.children}
      </div>
    </HeroTooltip>
  )
}
