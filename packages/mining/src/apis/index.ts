/**
 * @title Blueberry Ring
 * @description Ring api
 * @swagger 3.0.0
 * @version 1.0.0
 */

import type * as Types from './index.type'

export const baseURL = 'http://192.168.5.3:10010'

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
