import { TokenAwareCommand } from '../../lib/token-command'
import { SelectorCommand } from './selector-command'
import {initClient} from '../../lib/client'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'

export default class SelectorFilter extends SelectorCommand {
  static description = 'Replay an entities events.'

  /* eslint-disable quotes */
  static examples = [
    `$ evently selector:filter \
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
    meta: Flags.string({
      description: 'SQL JSONPath on the event\'s meta object',
    }),
    data: Flags.string({
      description: 'SQL JSONPath on the event\'s data object. This should be in the format "entity:event:jsonpath". Only the last component may have colons itself.',
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

    const filterRes = await client
      .follow('selectors')
      .follow('filter')

    if (!flags.data && !flags.meta) {
      throw new CLIError('At least one of the "--data" or "--meta" arguments must be specified')
    }

    const result = await filterRes.post({
      data: {
        data: flags.data ? parseDataFilter(flags.data) : undefined,
        meta: flags.meta,
        limit: flags.limit,
        after: flags.after,
      }
    })

    const [table, nextLink] = await this.parsePostResponse(result.data)
    this.renderTable(table, flags, nextLink)

  }

}


/**
 * Top level of this objects are entites, second level event names, values are JSONPath statements.
 */
type DataFilter = Record<string, Record<string, string>>

const dataFilterRe = /^([^:]+):([^:]+):(.*)$/

function parseDataFilter(input: string[]): DataFilter {

  const out: DataFilter = {}
  for(const item of input) {

    const matches = item.match(dataFilterRe)
    if (!matches) {
      throw new CLIError('The --filter argument must be in the format <entity-name>:<event-name>:<JSONPAth>.')
    }
    const [, entity, event, jsonPath] = matches
    if (!(entity in out)) {
      out[entity] = {}
    }
    out[entity][event] = jsonPath

  }
  return out

}
