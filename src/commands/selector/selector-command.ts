import {TokenAwareCommand} from '../../lib/token-command'
import { ux } from '@oclif/core'
import { Event } from '../../types'

export abstract class SelectorCommand extends TokenAwareCommand {

  renderTable(table: Event[], flags: Awaited<ReturnType<SelectorCommand['parse']>>['flags'], nextLink: string|null) {

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
    if (nextLink) {
      this.log('Next page: %s', nextLink)
    } else {
      this.log('No more data')
    }

  }

  async parsePostResponse(response: Response): Promise<[Event[], string]> {

    const records = []
    const lines = (await response.text()).trim().split('\n')
    for (const record of lines) {
      records.push(JSON.parse(record))
    }

    const table:Event[] = records.slice(0, -1)
    const meta = records.at(-1)

    return [
      table,
      meta._links?.next?.href ?? null
    ]

  }

}
