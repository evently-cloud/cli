import {Readable} from 'node:stream'
import {ValidationContext} from './types'
import { getClient } from '../client'

export async function openHttpLedgerReadStream(context?: ValidationContext): Promise<Readable> {
  const after = context?.previousEventId
  const afterMsg = after ? `after eventId ${after}` : 'fully'
  const body = after ? JSON.stringify({ after }): '{}'

  console.info('Downloading ledger %s.', afterMsg)

  const client = getClient()
  const downloadRes = await client
    .follow('ledgers')
    .follow('download')

  const response = await downloadRes.fetchOrThrow({
    method: 'POST',
    headers: {
      'Content-Type':     'application/json',
      'Accept':           'application/x-ndjson',
      'Prefer':           'return=representation',
      'Accept-Encoding':  'br'
    },
    body
  })

  if (!response.body) {
    throw new Error('No response body received')
  }

  /*
   * Currently we're using node-fetch which uses actual Node Readable
   * streams.
   *
   * But the types assume it's the same as a browser stream which is a "stream/web".ReadableStream.
   *
   * So for now we're just casting, until we can do away with node-fetch.
   */
  return Readable.fromWeb(response.body as any, {encoding: 'utf-8'})
}
