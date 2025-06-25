import type { Lineitem } from '@/apis/index.type'

export function parseOrderTracking(lineItems: Lineitem[] = []) {
  return lineItems
    .map(item => item.meta_data.filter(meta => meta.key === '_vi_wot_order_item_tracking_data'))
    .flat()
    .map(meta => JSON.parse(meta.value))
    .map(data => data.map((d: any) => ({
      url: d.carrier_url.replace('{tracking_number}', d.tracking_number),
      ...d,
    })))
    .flat()
}
