import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from '@heroui/react'

export function Header() {
  return (
    <HeroUINavbar className="mb-2">
      <NavbarContent>
        <NavbarBrand className="gap-3 max-w-fit">
          IHO Mining
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <RainbowkitWidget chain={false} />
      </NavbarContent>
    </HeroUINavbar>
  )
}
