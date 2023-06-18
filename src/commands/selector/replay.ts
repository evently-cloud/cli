import { TokenAwareCommand } from '../../lib/token-command'
import { SelectorCommand } from './selector-command'
import { initClient } from '../../lib/client'
import { ux, Flags } from '@oclif/core'

export default class SelectorReplay extends SelectorCommand {
  static description = 'Replay an entities events.'

  /* eslint-disable quotes */
  static examples = [
    `$ evently selector:replay \
  -n article \
  -e add-comment \
  -k author`,
    `$ evently selector:replay \
  -n article \
  -e add-comment -e delete-comment \
  -k author, -k date \
  --limit 10`,
  ]

  static flags = {
    entity: Flags.string({
      char:         'n',
      description:  'Entity name',
      required:     true,
    }),
    event: Flags .string({
      char:         'e',
      description:  'Event name',
      required:     false,
      multiple:     true,
    }),
    key: Flags.string({
      char:         'k',
      description:  'Entity keys to select for.',
      required:     true,
      multiple:     true,
    }),
    after: Flags.string({
      description: 'Select events that occur after this ledger mark or event ID.',
      char: 'a',
    }),
    limit: Flags.integer({
      description: 'Limit the number of returned events to this value.',
      char: 'l',
      default: 50,
      min: 1,
      max: 5000,
    }),
    ...TokenAwareCommand.flags,
    ...ux.table.flags(),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(SelectorReplay)

    const client = initClient(flags.token)

    const replayRes = await client
      .follow('selectors')
      .follow('replay')

    const result = await replayRes.post({
      data: {
        entity: flags.entity,
        events: flags.event,
        keys: flags.key,
        limit: flags.limit,
        after: flags.after,
      }
    })

    const [table, nextLink] = await this.parsePostResponse(result.data)
    this.renderTable(table, flags, nextLink)

  }

}
