import {Readable} from 'node:stream'
import {ReadableStream} from 'stream/web'
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
    cache: 'no-store',
    body
  })

  if (!response.body) {
    throw new Error('No response body received')
  }

  /*
     Ketting returns a web Response, whose body is a web stream. Node's pipeline() can't consume those,
     so cast it to a node Readable.
   */
  return Readable.fromWeb(response.body as ReadableStream, {encoding: 'utf-8'})
}
