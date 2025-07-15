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
export async function getMinerAccount(paths: Types.GetMinerAccountPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/miner/${paths.account}`, {
    ...config,
  })
  return response.json() as Promise<Types.Miner>
}
/**
 * @method get
 * @tags Miner
 */
export async function getMinerAccountDailyRewards(paths: Types.GetMinerAccountDailyRewardsPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/miner/${paths.account}/daily-rewards`, {
    ...config,
  })
  return response.json() as Promise<Types.MinerDailyReward[]>
}
/**
 * @method get
 * @tags User
 */
export async function getUserOwnerMiners(paths: Types.GetUserOwnerMinersPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/user/${paths.owner}/miners`, {
    ...config,
  })
  return response.json() as Promise<Types.Miner[]>
}
/**
 * @method get
 * @tags User
 */
export async function getUserOwnerDailyRewards(paths: Types.GetUserOwnerDailyRewardsPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/user/${paths.owner}/daily-rewards`, {
    ...config,
  })
  return response.json() as Promise<Types.UserDailyReward[]>
}
/**
 * @method post
 * @tags Sign
 */
export async function postSignRegister(body: Types.SignatureRegisterBody, config?: RequestInit) {
  const response = await fetch(`${baseURL}/sign/register`, {
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
