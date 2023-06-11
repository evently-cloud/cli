import {TokenAwareCommand} from '../../lib/token-command'
import {initClient} from '../../lib/client'
import { ux, Flags } from '@oclif/core'


type ReplayEvent = {
  entity: string
  key: string
  event: string
  eventId: string
  timestamp: string
  meta: Record<string, string>
  data: Record<string, any>
}

export default class SelectorReplay extends TokenAwareCommand {
  static description = 'Replay an entities events.'

  static examples = [
    `$ evently selector:replay \
  -n article \
  -e add-comment \
  -k author
`,
    `$ evently selector:replay \
  -n article \
  -e add-comment -e delete-comment \
  -k author, -k date \
  --limit 10
`,
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
    }),
    limit: Flags.integer({
      description: 'Limit the number of returned events to this value.',
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

    const records = []
    const lines = (await result.data.text()).trim().split('\n')
    for (const record of lines) {
      records.push(JSON.parse(record))
    }

    const table:ReplayEvent[] = records.slice(0, -1)
    const meta = records.at(-1)

    ux.table(
      table,
      {
        entity: {
          header: 'Entity',
        },
        key: {
          header: 'Key',
        },
        event: {
          header: 'Event',
        },
        eventId: {
          header: 'Event ID',
        },
        timestamp: {
          header: 'Timestamp',
        },
        meta: {
          header: 'Meta',
        },
        data: {
          header: 'Data',
        }
      },
      flags,
    )

    if ('next' in meta._links) {
      this.log('Next page: %s', meta._links.href)
    } else {
      this.log('No more data')
    }

  }

}
