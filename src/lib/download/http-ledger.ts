import {Readable} from "stream"
import {fetch} from "undici"
import {ValidationContext} from "./types"


export async function openHttpLedgerReadStream(token: string, context?: ValidationContext): Promise<NodeJS.ReadableStream> {
  const url = "https://preview.evently.cloud"
  const authorization = `Bearer ${token}`
  const after = context?.previousEventId
  const afterMsg = after ? `after eventId ${after}` : "fully"
  const body = after ? JSON.stringify({ after }): "{}"

  console.info("Downloading ledger %s from %s with Authorization: %s", afterMsg, url, authorization)

  const request = {
    url:      `${url}/ledgers/download`,
    method:   "POST",
    headers:  {
      "Content-Type":     "application/json",
      "Accept":           "application/x-ndjson",
      "Prefer":           "return=representation",
      "Accept-Encoding":  "br",
      authorization
    },
    body
  }

  const result = await fetch(`${url}/ledgers/download`, request)

  if (result.status === 200 && result.body) {
    const reader = Readable.from(result.body)
    reader.setEncoding("utf8")
    return reader
  }

  const message = await result.text()
  throw new Error(`${result.status} ${result.statusText}. Could not download ledger: ${message}`)
}