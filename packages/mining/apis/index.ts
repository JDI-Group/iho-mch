/**
 * @title Blueberry Ring
 * @description Ring api
 * @swagger 3.0.0
 * @version 1.0.0
 */

import type * as Types from './index.type'

export const baseURL = process.env.NEXT_PUBLIC_MINING_SERVICE_URL

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
