export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Moonchain IHO',
  description: 'The mining revolution begins with Moonchain’s Initial Hardware Offering (IHO), delivering the world’s first free, cutting-edge physical hardware miners to holders of Moonchain tokens via an Ethereum-based smart contract.',
  favicon: 'https://www.mchain.ai/images/logo-dark.png',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Products',
      href: '/products',
    },
    {
      label: 'Mining',
      disabled: true,
      href: process.env.NEXT_PUBLIC_NETWORK === 'moonchain_geneva' ? '-' : 'https://iho-mining.mchain.ai/',
    },
  ],
  navMenuItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Products',
      href: '/products',
    },
    {
      label: 'Mining',
      disabled: true,
      href: process.env.NEXT_PUBLIC_NETWORK === 'moonchain_geneva' ? '-' : 'https://iho-mining.mchain.ai/',
    },
  ],
  links: [
    {
      label: 'Privacy Policy',
      href: 'https://doc.mchain.ai/docs/Resources/Moonbase-Privacy-Policy',
    },
    {
      label: 'Terms of Use',
      href: 'https://doc.mchain.ai/docs/Resources/tns',
    },
    // {
    //   label: 'Sales and Refunds',
    //   href: '/sales-and-refunds',
    // },
    // {
    //   label: 'Legal',
    //   href: '/legal',
    // },
    // {
    //   label: 'Site Map',
    //   href: '/site-map',
    // },
  ],
}
