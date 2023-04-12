import { Flags } from '@oclif/core'
import { TokenAwareCommand } from '../../lib/token-command'
import { initClient, followByName } from '../../lib/client'

export default class Delete extends TokenAwareCommand {
  static description = 'Deletes an event type from the registry. This only works if no events of this type have been created.'

  static examples = [
    `$ evently registry:delete -n article -e add-comment
Deleted entity event type https://preview.evently.cloud/registry/article/add-comment
`]


  static flags = {
    ...TokenAwareCommand.flags,
    event: Flags.string({
      char:         'e',
      description:  'Event name',
      required:     true,
    }),
    entity: Flags.string({
      char:         'n',
      description:  'Entity name',
      required:     true,
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Delete)

    const client = initClient(flags.token)

    const {event, entity} = flags

    const entityRes = await followByName(
      await client.follow('registry').follow('entities'),
      entity
    )

    const eventRes = await followByName(
      entityRes,
      event
    )

    await eventRes.delete()

    this.log(
      'Deleted entity event type: %s',
      eventRes.uri
    )

  }

}
