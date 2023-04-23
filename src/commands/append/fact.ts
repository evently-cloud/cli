import {Flags} from '@oclif/core'
import {TokenAwareCommand} from '../../lib/token-command'
import {initClient} from '../../lib/client'
import fs from 'node:fs/promises'
import JSON5 from 'json5'
import Ajv from 'ajv'

export default class Reset extends TokenAwareCommand {
  static description = 'Appends a factual event to the ledger'

  static examples = [
    `$ evently append:fact <<EVENT 
{
  entity: "thermostat",
  event: "temperature-recorded",
  key: "thermostat1",
  meta: {causation: "14rew3494"},
  data:{celsius: 18.5}
}
EVENT

Created new event at: https://preview.evently.cloud/selectors/fetch/ijfoij2oip4gj4wd.json
`]


  static flags = {
    ...TokenAwareCommand.flags,
    file: Flags.string({
      char:         'f',
      description:  'Read event data from this file. If no file is given, STDIN is used.',
      required:     false,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Reset)

    let strBody:string
    if (flags.file) {
      strBody = await fs.readFile(flags.file, 'utf-8')
    } else if (!process.stdin.isTTY) {
      const chunks = []
      for await (const chunk of process.stdin) {
        chunks.push(chunk)
      }
      strBody = (Buffer.concat(chunks)).toString('utf-8')
    } else {
      throw new Error('To use this command, you must either specify an input file with --file, or pipe your event data to STDIN')
    }

    const body = JSON5.parse(strBody)

    const client = initClient(flags.token)

    const appendRes = await client
      .follow('append')
      .follow('factual')

    const jsonSchema = (await appendRes.get()).data
    const ajv = new Ajv()
    const valid = ajv.validate(jsonSchema, body)

    if (!valid) {
      this.logToStderr(`Got ${ajv.errors?.length} error(s) during schema validation:`)
      this.logToStderr(ajv.errorsText(ajv.errors))
      this.exit(1)
    }

    const newEventRes = await appendRes.postFollow({
      data: body
    })

    this.log(`Created new event at: ${newEventRes.uri}`)

  }

}
