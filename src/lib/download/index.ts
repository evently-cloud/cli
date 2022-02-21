import * as fs from "fs"
import * as stream from "stream"
import {pipeline} from "stream/promises"
import {promisify} from "util"
import {validateLedgerFile} from "./file-ledger"
import {openHttpLedgerReadStream} from "./http-ledger"
import {LinesTransformer} from "./lines-transformer"
import {ValidationTransformer} from "./validationTransformer"

const finished = promisify(stream.finished);


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

  // Wait for the file write stream to finish.
  await finished(fileWriteStream)

  return context.count
}
