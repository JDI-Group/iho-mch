export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Moonchain IHO',
  description: 'The mining revolution begins with Moonchain’s Initial Hardware Offering (IHO), delivering the world’s first free, cutting-edge physical hardware miners to holders of Moonchain tokens via an Ethereum-based smart contract.',
  favicon: 'https://explorer.moonchain.com/assets/favicon/favicon.ico',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Products',
      href: '/products',
    },
  ],
  navMenuItems: [
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
  links: [
    {
      label: 'Privacy Policy',
      href: 'https://doc.moonchain.com/docs/Resources/Moonbase-Privacy-Policy',
    },
    {
      label: 'Terms of Use',
      href: 'https://doc.moonchain.com/docs/Resources/tns',
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
