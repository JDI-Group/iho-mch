export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Next.js + HeroUI',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: [
    {
      label: 'Products',
      href: '/products',
    },
    {
      label: 'NFT Marketplaces',
      href: 'https://nft.moonchain.com',
    },
    {
      label: 'Bridge',
      href: 'https://jannowitz.moonchain.com',
    },
    {
      label: 'Mining',
      href: 'https://miningv2.matchx.io',
    },
    {
      label: 'Explorer',
      href: 'https://explorer.moonchain.com',
    },
  ],
  navMenuItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Docs',
      href: '/docs',
    },
    {
      label: 'Pricing',
      href: '/pricing',
    },
    {
      label: 'Blog',
      href: '/blog',
    },
    {
      label: 'About',
      href: '/about',
    },
  ],
  links: {
    github: 'https://github.com/heroui-inc/heroui',
    twitter: 'https://twitter.com/hero_ui',
    docs: 'https://heroui.com',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
}
