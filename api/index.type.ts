/**
 * @title Initial Hardware Offering
 * @description Moonchain Initial Hardware Offering (IHO) is a revolutionary mining concept combining cutting-edge hardware with your own decentralized wallet. We're offering mining hardware at no cost—just choose your desired Hardware, lock your Moonchain and start mining. It's never been easier or more rewarding to mine. Don't miss out—join the future of mining today!
 * @swagger 3.0.0
 * @version 1.0
 */

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}
export interface AttributeTarget {
  id: number;
  name: string;
  option: string;
}
export interface Category {
  id: number;
  name: string;
  slug: string;
}
export interface Dimensions {
  length: string;
  width: string;
  height: string;
}
export interface Image {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}
export interface Links {
  self: string[];
  collection: string[];
}
export interface Metadata {
  id: number;
  key: string;
  value: any;
}
export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: any;
  date_on_sale_from_gmt: any;
  date_on_sale_to: any;
  date_on_sale_to_gmt: any;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: string[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: any;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: any;
  sold_individually: boolean;
  weight: string;
  dimensions: Dimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  parent_id: number;
  purchase_note: string;
  categories: string[];
  tags: string[];
  images: Image[];
  attributes: Attribute[];
  default_attributes: AttributeTarget[];
  variations: string[];
  grouped_products: string[];
  menu_order: number;
  price_html: string;
  related_ids: string[];
  meta_data: Metadata[];
  stock_status: string;
  has_options: boolean;
  post_password: string;
  global_unique_id: string;
  brands: string[];
  _links: Links;
}
export interface Address {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}
export interface Order {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  order_key: string;
  billing: Address;
  shipping: Address;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_ip_address: string;
  customer_user_agent: string;
  created_via: string;
  customer_note: string;
  date_completed: any;
  date_paid: any;
  cart_hash: string;
  number: string;
  meta_data: string[];
  line_items: string[];
  tax_lines: string[];
  shipping_lines: string[];
  fee_lines: string[];
  coupon_lines: string[];
  refunds: string[];
  payment_url: string;
  is_editable: boolean;
  needs_payment: boolean;
  needs_processing: boolean;
  date_created_gmt: string;
  date_modified_gmt: string;
  date_completed_gmt: any;
  date_paid_gmt: any;
  store_credit_used: number;
  currency_symbol: string;
  _links: Links;
}
export interface VerifyDto {
  message: string;
  signature: string;
}
export interface Customer {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  email: string;
  first_name: string;
  last_name: string;
  billing: Address;
  shipping: Address;
  role: string;
  username: string;
  is_paying_customer: boolean;
  avatar_url: string;
  meta_data: string[];
  _links: string[];
}
export interface CustomerUpdateDto {
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  billing?: Address;
  shipping?: Address;
  role?: string;
  username?: string;
  is_paying_customer?: boolean;
  avatar_url?: string;
  meta_data?: string[];
  _links?: string[];
}
export interface GetProductIdPath {
  id: number;
}
export interface GetProductFilesSuffixPath {
  suffix: string;
}
export interface GetUserInspectHeader {
  token?: string;
  [key: string]: any;
}
export interface GetUserHeader {
  token?: string;
  [key: string]: any;
}
export interface PutUserHeader {
  token?: string;
  [key: string]: any;
}
