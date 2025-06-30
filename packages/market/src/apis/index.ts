/**
 * @title Initial Hardware Offering
 * @description Moonchain Initial Hardware Offering (IHO) is a revolutionary mining concept combining cutting-edge hardware with your own decentralized wallet. We're offering mining hardware at no cost—just choose your desired Hardware, lock your Moonchain and start mining. It's never been easier or more rewarding to mine. Don't miss out—join the future of mining today!
 * @swagger 3.0.0
 * @version 1.0
 */

import * as Types from "./index.type";

export const baseURL = process.env.NEXT_PUBLIC_MARKET_SERVICE_URL!;

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
export async function getProductStatistics(config?: RequestInit) {
  const response = await fetch(`${baseURL}/product/statistics`, {
    ...config,
  });
  return response.json() as Promise<Types.ProductStats[]>;
}
/**
 * @method get
 * @tags Product
 */
export async function getProductStatisticsId(paths: Types.GetProductStatisticsIdPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/product/statistics/${paths.id}`, {
    ...config,
  });
  return response.json() as Promise<Types.ProductStats>;
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
export async function getProductIdVariations(paths: Types.GetProductIdVariationsPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/product/${paths.id}/variations`, {
    ...config,
  });
  return response.json() as Promise<Types.Variation[]>;
}
/**
 * @method get
 * @tags Product
 */
export async function getProductIdVariationsVariation(paths: Types.GetProductIdVariationsVariationPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/product/${paths.id}/variations/${paths.variation}`, {
    ...config,
  });
  return response.json() as Promise<Types.Variation>;
}
/**
 * @method get
 * @tags Order
 */
export async function getOrder(query?: Types.GetOrderQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/order?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.Order[]>;
}
/**
 * @method post
 * @tags Order
 */
export async function postOrder(body: Types.OrderCreateDto, query?: Types.PostOrderQuery, headers?: Types.PostOrderHeader, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/order?${querystr}`, {
    headers: { "Content-Type": "application/json", ...headers },
    method: "post",
    body: JSON.stringify(body),
    ...config,
  });
  return response.json() as Promise<Types.OrderDataDto>;
}
/**
 * @method get
 * @tags Order
 */
export async function getOrderId(paths: Types.GetOrderIdPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/order/${paths.id}`, {
    ...config,
  });
  return response.json() as Promise<Types.Order>;
}
/**
 * @method delete
 * @tags Order
 */
export async function deleteOrderId(paths: Types.DeleteOrderIdPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/order/${paths.id}`, {
    method: "delete",
    ...config,
  });
  return response;
}
/**
 * @method post
 * @tags Order
 */
export async function postOrderPay(body: Types.OrderPutDto, config?: RequestInit) {
  const response = await fetch(`${baseURL}/order/pay`, {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify(body),
    ...config,
  });
  return response.json() as Promise<Types.OrderDataDto>;
}
/**
 * @method put
 * @tags Order
 */
export async function putOrderCancel(body: Types.OrderPutDto, config?: RequestInit) {
  const response = await fetch(`${baseURL}/order/cancel`, {
    headers: { "Content-Type": "application/json" },
    method: "put",
    body: JSON.stringify(body),
    ...config,
  });
  return response;
}
/**
 * @method get
 * @tags Stats
 */
export async function getStats(config?: RequestInit) {
  const response = await fetch(`${baseURL}/stats`, {
    ...config,
  });
  return response.json() as Promise<Types.StatsBatchItem[]>;
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
