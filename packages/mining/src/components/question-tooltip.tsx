import { Tooltip } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'

export interface QuestionTooltipProps {
  content: string
}

export function QuestionTooltip(props: QuestionTooltipProps) {
  const [openTooltip, setOpenTooltip] = useState<boolean>(false)
  const tooltipContentRef = useRef<HTMLDivElement>(null)
  useOutsideClick(tooltipContentRef, () => setOpenTooltip(false))

  return (
    <Tooltip
      content={props.content}
      isOpen={openTooltip}
      size="sm"
    >
      <div className="inline-flex" ref={tooltipContentRef} onClick={() => setOpenTooltip(!openTooltip)}>
        <Icon className="text-base mt-[1px]" icon="line-md:question-circle" />
      </div>
    </Tooltip>
  )
}
