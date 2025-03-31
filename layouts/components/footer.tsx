import type { PropsWithDetailedHTML } from '@hairy/react-lib'
import { Link } from '@heroui/link'

export function Footer(props: PropsWithDetailedHTML) {
  return (
    <footer {...props} className={clsx('w-full flex items-center justify-between py-3', props.className)}>
      <Link
        isExternal
        className="flex items-center gap-1 text-current"
        href="https://moonchain.com"
      >
        <span className="text-default-600">© 2025 </span>
        <p className="text-primary">Moonchain</p>
        <span>. All rights reserved.</span>
      </Link>
      <div className="flex items-center gap-2 text-default-600">
        <span>Privacy Policy</span>
        <span>|</span>
        <span>Terms of Use</span>
        <span>|</span>
        <span>Sales and Refunds</span>
        <span>|</span>
        <span>Legal</span>
        <span>|</span>
        <span>Site Map</span>
      </div>
    </footer>
  )
}
