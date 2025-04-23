import type { PropsWithDetailedHTML } from '@hairy/react-lib'
import { siteConfig } from '@/config/site'
import { Link } from '@heroui/link'
import { clsx } from 'clsx'

export function Footer(props: PropsWithDetailedHTML) {
  return (
    <footer {...props} className={clsx('flex flex-col gap-2 md:flex-row items-center justify-between py-3', props.className)}>
      <Link
        isExternal
        className="flex items-center gap-1 text-current"
        href="https://moonchain.com"
      >
        <span className="text-default-600">© 2025 </span>
        <p className="text-primary">Moonchain</p>
        <span>. All rights reserved.</span>
      </Link>
      <div className="flex flex-wrap justify-center items-center gap-2">
        {siteConfig.links.map((link, index) => (
          <div key={link.href} className="flex items-center gap-2">
            <Link
              color="foreground"
              className="text-sm"
              href={link.href}
            >
              {link.label}
            </Link>
            {index !== siteConfig.links.length - 1 && (
              <div className="h-3 w-px bg-default-400" />
            )}
          </div>
        ))}
      </div>
    </footer>
  )
}
