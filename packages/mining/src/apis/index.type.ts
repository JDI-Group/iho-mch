/**
 * @title Blueberry Ring
 * @description Ring api
 * @swagger 3.0.0
 * @version 1.0.0
 */

export interface Miner {
  owner: string;
  token: string;
  tokenId: number;
  name: string;
  mac: string;
  account: string;
  blockHeight: number;
  timestamp: number;
}
export interface SignatureRegisterBody {
  owner: string;
  name: string;
  mac: string;
}
export interface SignatureResponse {
  data: string;
}
export interface GetMinerMacPath {
  /** @description MAC address of the miner */
  mac: string;
}
