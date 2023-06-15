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

export default class SelectorFilter extends TokenAwareCommand {
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
    'meta-filter': Flags.string({
      description: 'SQL JSONPath on the event\'s meta object',
      multiple: true,
    }),
    'data-filter': Flags.string({
      description: 'SQL JSONPath on the event\'s data object',
      multiple: true,
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
    const {flags} = await this.parse(SelectorFilter)

    const client = initClient(flags.token)

    const replayRes = await client
      .follow('selectors')
      .follow('filter')

    const result = await replayRes.post({
      data: {
        entity: flags.entity,
        events: flags.event,
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

    this.log('')
    if ('next' in meta._links) {
      this.log('Next page: %s', meta._links.next.href)
    } else {
      this.log('No more data')
    }

  }

}
