import {CLIError} from '@oclif/core/lib/parser/errors'
import {Readable} from 'node:stream'
import {ReadableStream} from 'stream/web'
import {ValidationContext} from './types'
import { getClient } from '../client'

export async function openHttpLedgerReadStream(token: string, context?: ValidationContext): Promise<Readable> {
  const after = context?.previousEventId
  const afterMsg = after ? `after eventId ${after}` : 'fully'
  const body = after ? JSON.stringify({ after }): '{}'

  console.info('Downloading ledger %s.', afterMsg)

  const client = getClient()
  const downloadRes = await client
    .follow('ledgers')
    .follow('download')
  const downloadUri = downloadRes.uri

  const response = await fetch(downloadUri, {
    method: 'POST',
    headers: {
      'Content-Type':     'application/json',
      'Accept':           'application/x-ndjson',
      'Prefer':           'return=representation',
      'Accept-Encoding':  'br',
      'Authorization':    `Bearer ${token}`
    },
    body
  })

  if (!response.body) {
    throw new Error('No response body received')
  }
  if (response.status == 200) {
    return Readable.fromWeb(response.body as ReadableStream, {encoding: 'utf-8'})
  }
  const errorBody = await response.text()
  throw new CLIError(`can't download: ${errorBody}`)
}
