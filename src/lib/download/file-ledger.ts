import * as fs from "fs"
import {pipeline} from "stream/promises"
import {LinesTransformer} from "./lines-transformer"
import {ValidationContext} from "./types"
import {ValidationTransformer} from "./validator"


export async function validateLedgerFile(path: string): Promise<ValidationContext> {
  const validator = new ValidationTransformer(false)

  if (fs.existsSync(path)) {
    console.info("loading file %s", path)
    const fileReadStream = fs.createReadStream(path)
    fileReadStream.setEncoding("utf8")

    await pipeline(
      fileReadStream,
      new LinesTransformer(),
      validator
    )
  } else {
    console.info("no ledger file at %s", path)
  }

  return validator.context
}
