import { Flags } from '@oclif/core'
import JSON5 from 'json5'
import fs from 'node:fs/promises'

export const flags = {
  file: Flags.string({
    char:         'f',
    description:  'Read event data from this file. If neither --body nor --file is given, STDIN is used.',
    required:     false,
  }),
  body: Flags.string({
    char:         'b',
    description:  'Read data from argument. If neither --body nor --file is given, STDIN is used.',
    required:     false,
  }),

}

type BodyFlags = {
  file: string|undefined
  body: string|undefined
}

export async function readJson5(flags: BodyFlags): Promise<Record<string, any>> {

  if (flags.body !== undefined && flags.file !== undefined) {
    throw new Error('The ---body and --file arguments are mutually exclusive.')
  }

  let strBody:string
  if (flags.file) {
    strBody = await fs.readFile(flags.file, 'utf-8')
  } else if (flags.body) {
    strBody = flags.body
  } else if (!process.stdin.isTTY) {
    const chunks = []
    for await (const chunk of process.stdin) {
      chunks.push(chunk)
    }
    strBody = Buffer.concat(chunks).toString('utf-8')
  } else {
    throw new Error('To use this command, you must either specify an input file with --file, or pipe your event data to STDIN')
  }

  return JSON5.parse(strBody)

}
