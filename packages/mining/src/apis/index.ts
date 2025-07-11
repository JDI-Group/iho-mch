/**
 * @title Blueberry Ring
 * @description Ring api
 * @swagger 3.0.0
 * @version 1.0.0
 */

import type * as Types from './index.type'

export const baseURL = process.env.NEXT_PUBLIC_MINING_SERVICE_URL

/**
 * @method get
 * @tags Product
 */
export async function getProduct(config?: RequestInit) {
  const response = await fetch(`${baseURL}/product`, {
    ...config,
  })
  return response.json() as Promise<Types.Product[]>
}
/**
 * @method get
 * @tags Product
 */
export async function getProductSearch(query: Types.GetProductSearchQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}))
  const response = await fetch(`${baseURL}/product/search?${querystr}`, {
    ...config,
  })
  return response.json() as Promise<Types.Product>
}
/**
 * @method get
 * @tags Miner
 */
export async function getMiner(query: Types.GetMinerQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}))
  const response = await fetch(`${baseURL}/miner?${querystr}`, {
    ...config,
  })
  return response.json() as Promise<Types.Miner[]>
}
/**
 * @method get
 * @tags Miner
 */
export async function getMinerAccount(paths: Types.GetMinerAccountPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/miner/${paths.account}`, {
    ...config,
  })
  return response.json() as Promise<Types.Miner>
}
/**
 * @method post
 * @tags Sign
 */
export async function postSignRegisterDevice(body: Types.SignatureRegisterBody, config?: RequestInit) {
  const response = await fetch(`${baseURL}/sign/registerDevice`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify(body),
    ...config,
  })
  return response.json() as Promise<Types.SignatureResponse>
}
/**
 * @method post
 * @tags Task
 */
export async function postTaskManuallyTriggerRewards(body: Types.ManuallyTriggerRewardsBody, config?: RequestInit) {
  await fetch(`${baseURL}/task/manually-trigger/rewards`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify(body),
    ...config,
  })
}
