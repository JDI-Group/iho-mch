/**
 * @title Initial Hardware Offering
 * @description Moonchain Initial Hardware Offering (IHO) is a revolutionary mining concept combining cutting-edge hardware with your own decentralized wallet. We're offering mining hardware at no cost—just choose your desired Hardware, lock your Moonchain and start mining. It's never been easier or more rewarding to mine. Don't miss out—join the future of mining today!
 * @swagger 3.0.0
 * @version 1.0
 */

import * as Types from "./index.type";

export const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * @method get
 * @tags Product
 */
export async function getProduct(config?: RequestInit) {
  const response = await fetch(`${baseURL}/product`, {
    ...config,
  });
  return response.json() as Promise<Types.Product[]>;
}
/**
 * @method get
 * @tags Product
 */
export async function getProductId(paths: Types.GetProductIdPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/product/${paths.id}`, {
    ...config,
  });
  return response.json() as Promise<Types.Product>;
}
/**
 * @method get
 * @tags Product
 */
export async function getProductFilesSuffix(paths: Types.GetProductFilesSuffixPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/product/files/${paths.suffix}`, {
    ...config,
  });
  return response;
}
/**
 * @method get
 * @tags Order
 */
export async function getOrder(config?: RequestInit) {
  const response = await fetch(`${baseURL}/order`, {
    ...config,
  });
  return response.json() as Promise<Types.Order[]>;
}
/**
 * @method post
 * @tags Order
 */
export async function postOrder(config?: RequestInit) {
  await fetch(`${baseURL}/order`, {
    method: "post",
    ...config,
  });
}
/**
 * @method get
 * @tags User
 */
export async function getUserNonce(config?: RequestInit) {
  const response = await fetch(`${baseURL}/user/nonce`, {
    ...config,
  });
  return response.text() as Promise<string>;
}
/**
 * @method post
 * @tags User
 */
export async function postUserVerify(body: Types.VerifyDto, config?: RequestInit) {
  const response = await fetch(`${baseURL}/user/verify`, {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify(body),
    ...config,
  });
  return response.text() as Promise<string>;
}
/**
 * @method get
 * @tags User
 */
export async function getUserLogout(config?: RequestInit) {
  const response = await fetch(`${baseURL}/user/logout`, {
    ...config,
  });
  return response;
}
/**
 * @method get
 * @tags User
 */
export async function getUserInspect(headers?: Types.GetUserInspectHeader, config?: RequestInit) {
  const response = await fetch(`${baseURL}/user/inspect`, {
    headers,
    ...config,
  });
  return response;
}
/**
 * @method get
 * @tags User
 */
export async function getUser(headers?: Types.GetUserHeader, config?: RequestInit) {
  const response = await fetch(`${baseURL}/user`, {
    headers,
    ...config,
  });
  return response.json() as Promise<Types.Customer>;
}
/**
 * @method put
 * @tags User
 */
export async function putUser(body: Types.CustomerUpdateDto, headers?: Types.PutUserHeader, config?: RequestInit) {
  const response = await fetch(`${baseURL}/user`, {
    headers: { "Content-Type": "application/json", ...headers },
    method: "put",
    body: JSON.stringify(body),
    ...config,
  });
  return response;
}
