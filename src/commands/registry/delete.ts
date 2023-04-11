import {Flags} from '@oclif/core'
import {TokenAwareCommand} from '../../lib/token-command'
import {initClient} from '../../lib/client'
import {Resource} from 'ketting'

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
      await client.follow('registry'),
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

/**
 * Loops through a Ketting links with the level3 list-entry link and finds
 * the first resource that has the specified name property.
 *
 * If the resource was not found, this will throw an error.
 */
async function followByName(parent: Resource, name: string): Promise<Resource> {

  const links = await parent.links('https://level3.rest/patterns/list#list-entry')
  for(const link of links) {
    if (link.name === name) {
      return parent.client.go(link)
    }
  }
  throw new Error(`Could not find an entry with name ${name} in collection ${parent.uri}`)

}
