import {Readable} from "stream"
import {sendToEvently} from "../evently-connect"
import {ValidationContext} from "./types"


export async function openHttpLedgerReadStream(token: string, context?: ValidationContext): Promise<Readable> {
  const after = context?.previousEventId
  const afterMsg = after ? `after eventId ${after}` : "fully"
  const body = after ? JSON.stringify({ after }): "{}"

  console.info("Downloading ledger %s.", afterMsg)

  const request = {
    url:      "/ledgers/download",
    method:   "POST",
    headers:  {
      "Content-Type":     "application/json",
      "Accept":           "application/x-ndjson",
      "Prefer":           "return=representation",
      "Accept-Encoding":  "br"
    },
    body
  }

  const result = await sendToEvently(token, "/ledgers/download", request)

  if (result.status === 200 && result.body) {
    return Readable.from(result.body)
  }

  const message = await result.text()
  throw new Error(`${result.status} ${result.statusText}. Could not download ledger: ${message}`)
}
