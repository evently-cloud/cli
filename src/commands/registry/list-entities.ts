import { TokenAwareCommand } from '../../lib/token-command'
import { initClient } from '../../lib/client'
import { ux } from '@oclif/core'

export default class ListEntities extends TokenAwareCommand {
  static description = ''

  static examples = [
    `$ evently registry:list-entities
`]


  static flags = {
    ...TokenAwareCommand.flags,
    ...ux.table.flags(),
  }

  async run(): Promise<void> {

    const {flags} = await this.parse(ListEntities)

    const client = initClient(flags.token)

    const entities = await client
      .follow('registry')
      .follow('entities')
      .followAll('https://level3.rest/patterns/list#list-entry')
      .preferTransclude()

    const table: Record<string, string>[] = []


    for(const entity of entities) {

      const entityState = await entity.get()
      table.push({
        name: entityState.data.name,
        uri: entity.uri
      })

    }

    ux.table(
      table,
      {
        name: {
          header: 'Name',
        },
        uri: {
          header: 'URI',
        }
      },
      flags,
    )

  }

}
