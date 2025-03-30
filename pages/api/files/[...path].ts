import type { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'node:stream'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FILE_PREFIX } from '@/config/constants'
import { isArray } from '@hairy/utils'

async function Handler(req: NextApiRequest, res: NextApiResponse<string>) {
  const paths = !isArray(req.query.path) ? [req.query.path as string].filter(Boolean) : req.query.path
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }
  const url = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}${FILE_PREFIX}${paths.join('/')}`
  const response = await fetch(url)
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  Readable.fromWeb(response.body).pipe(res)
}

export default Handler
