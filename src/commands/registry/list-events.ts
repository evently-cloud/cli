import { TokenAwareCommand } from '../../lib/token-command'
import { followByName, initClient } from '../../lib/client'
import { ux, Flags } from '@oclif/core'

export default class ListEvents extends TokenAwareCommand {
  static description = 'Lists all event types for an entity.'

  static examples = [
    `$ evently registry:list-events --entity my-entity
`]


  static flags = {
    entity: Flags.string({
      char:         'n',
      description:  'Entity name',
      required:     true,
    }),
    ...TokenAwareCommand.flags,
    ...ux.table.flags(),

  }

  async run(): Promise<void> {

    const {flags} = await this.parse(ListEvents)

    const client = initClient(flags.token)

    const entityRes = await followByName(
      await client.follow('registry').follow('entities'),
      flags.entity
    )

    const events = await entityRes
      .followAll('https://level3.rest/patterns/list#list-entry')
      .preferTransclude()

    const table: Record<string, string>[] = []
    for(const event of events) {

      const eventState = await event.get()
      table.push({
        name: eventState.data.event,
        uri: event.uri
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
