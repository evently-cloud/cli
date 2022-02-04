import * as fs from "fs"
import {pipeline} from "stream/promises"
import {validateLedgerFile} from "./file-ledger"
import {openHttpLedgerReadStream} from "./http-ledger"
import {LinesTransformer} from "./lines-transformer"
import {ValidationTransformer} from "./validator"


export async function downloadAndValidateLedger(token: string, ledgerFile: string): Promise<number> {

  // this may take a while, so validate the file before opening the http connection
  const context = await validateLedgerFile(ledgerFile)

  const httpReadStream = await openHttpLedgerReadStream(token, context)

  const fileWriteStream = fs.createWriteStream(ledgerFile, {
    encoding: "utf8",
    // append
    flags:    "a"
  })

  await pipeline(
    httpReadStream,
    new LinesTransformer(),
    new ValidationTransformer(true, context),
    fileWriteStream)

  return context.count
}
