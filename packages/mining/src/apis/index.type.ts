/**
 * @title Blueberry Ring
 * @description Ring api
 * @swagger 3.0.0
 * @version 1.0.0
 */

export interface Attribute {
  id: number
  name: string
  slug: string
  position: number
  visible: boolean
  variation: boolean
  options: string[]
}
export interface AttributeTarget {
  id: number
  name: string
  option: string
  slug: string
}
export interface Category {
  id: number
  name: string
  slug: string
}
export interface Dimensions {
  length: string
  width: string
  height: string
}
export interface Image {
  id: number
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  src: string
  name: string
  alt: string
}
export interface Links {
  self: string[]
  collection: string[]
}
export interface Metadata {
  /** @description Meta ID. */
  id: number
  /** @description Meta key. */
  key: string
  /** @description Meta value. */
  value: any
}
export interface Product {
  id: number
  ether: string
  upcoming: boolean
  ready: boolean
  orders: number
  target: number
  limit: number
  name: string
  slug: string
  permalink: string
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  type: string
  status: string
  featured: boolean
  catalog_visibility: string
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  date_on_sale_from: any
  date_on_sale_from_gmt: any
  date_on_sale_to: any
  date_on_sale_to_gmt: any
  on_sale: boolean
  purchasable: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  downloads: string[]
  download_limit: number
  download_expiry: number
  external_url: string
  button_text: string
  tax_status: string
  tax_class: string
  manage_stock: boolean
  stock_quantity: any
  backorders: string
  backorders_allowed: boolean
  backordered: boolean
  low_stock_amount: any
  sold_individually: boolean
  weight: string
  dimensions: Dimensions
  shipping_required: boolean
  shipping_taxable: boolean
  shipping_class: string
  shipping_class_id: number
  reviews_allowed: boolean
  average_rating: string
  rating_count: number
  parent_id: number
  purchase_note: string
  categories: string[]
  tags: string[]
  images: Image[]
  attributes: Attribute[]
  default_attributes: AttributeTarget[]
  variations: string[]
  grouped_products: string[]
  menu_order: number
  price_html: string
  related_ids: string[]
  meta_data: Metadata[]
  stock_status: string
  has_options: boolean
  post_password: string
  global_unique_id: string
  brands: string[]
  _links: Links
}
export interface Miner {
  owner: string
  token: string
  tokenId: number
  product: number
  image: string
  description: string
  name: string
  mac: string
  account: string
  blockHeight: number
  timestamp: number
  traits: string[]
}
export interface SignatureRegisterBody {
  product: number
  owner: string
  name: string
  mac: string
}
export interface SignatureResponse {
  data: string
}
export interface ManuallyTriggerRewardsBody {
  address: string
  key: string
}
export interface GetProductSearchQuery {
  keyword: string
}
export interface GetMinerQuery {
  /** @description User address */
  user: string
}
export interface GetMinerAccountPath {
  /** @description MAC address of the miner */
  account: string
}
