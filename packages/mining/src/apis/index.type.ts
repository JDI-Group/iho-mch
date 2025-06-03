/**
 * @title Blueberry Ring
 * @description Ring api
 * @swagger 3.0.0
 * @version 1.0.0
 */

export interface SignatureRegisterBody {
  owner: string
  name: string
  mac: string
}
export interface SignatureResponse {
  data: string
}
