import {Flags} from '@oclif/core'
import {TokenAwareCommand} from '../../lib/token-command'
import {initClient} from '../../lib/client'

export default class New extends TokenAwareCommand {
  static description = 'Creates a new entity event type.'

  static examples = [
    `$ evently registry:new -n article -e add-comment
Created entity event type at https://preview.evently.cloud/registry/article/add-comment
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
    const {flags} = await this.parse(New)

    const client = initClient(flags.token)

    const {event, entity} = flags
    const body = {
      event,
      entity,
    }

    const resetRes = await client
      .follow('registry')
      .follow('register')

    const newEntityEventRes = await resetRes.postFollow({data: body})


    this.log(
      'Created a new entity event type at %s',
      newEntityEventRes.uri
    )

  }

}
