import * as fs from 'fs'
import {pipeline} from 'stream/promises'
import {linesIterator} from './json-lines'
import {ValidationContext} from './types'
import {linesValidator} from './validator'


export async function validateLedgerFile(path: string): Promise<ValidationContext> {
  const context = {
    ledgerId:        '',
    count:           0,
    previousEventId: ''
  }

  if (fs.existsSync(path)) {
    console.info('loading file %s', path)
    const fileReadStream = fs.createReadStream(path)

    await pipeline(
      fileReadStream,
      linesIterator,
      linesValidator(false, context)
    )
  } else {
    console.info('no ledger file at %s', path)
  }

  return context
}
