import type {
  NavbarProps,
} from '@heroui/navbar'
import { siteConfig } from '@/config/site'
import { If } from '@hairy/react-lib'
import { Button } from '@heroui/button'

import { Link } from '@heroui/link'
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/navbar'
import { link as linkStyles } from '@heroui/theme'
import { useOverlayInject } from '@overlastic/react'
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'

import NextLink from 'next/link'
import { useAccount } from 'wagmi'

export function Navbar(props: NavbarProps) {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const openSettingsDialog = useOverlayInject(SettingsDialog)
  const { isConnected } = useAccount()

  return (
    <HeroUINavbar maxWidth="xl" position="sticky" {...props}>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            {/* <Logo /> */}
            <span className="font-spacex mt-1">
              MOONCHAIN
            </span>
          </NextLink>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map(item => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex">
          <ConnectButton />
        </NavbarItem>
        {/* <NavbarItem className="hidden sm:flex">
          <div className="cursor-pointer" onClick={() => openSettingsDialog()}>
            <SettingIcon className="text-default-600" size={22} />
          </div>
        </NavbarItem> */}
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <If cond={isConnected}>
          <NavbarItem>
            <div className="rainbow-wrapper">
              <RainbowConnectButton
                chainStatus={{ smallScreen: 'none' }}
                accountStatus={{ smallScreen: 'avatar' }}
              />
            </div>
          </NavbarItem>
        </If>
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mt-2 flex flex-col gap-3">
          <NavbarMenuItem>
            <ConnectButton status={false} />
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Button className="w-full">
              Contact Us
            </Button>
          </NavbarMenuItem>
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color="foreground"
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  )
}
