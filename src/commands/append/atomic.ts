import {TokenAwareCommand} from '../../lib/token-command'
import {initClient} from '../../lib/client'
import * as bodyInputHelper from '../../lib/body-input-helper'

export default class AtomicFact extends TokenAwareCommand {
  static description = 'Appends a serial event to the ledger'

  static examples = [
    `$ evently append:atomic <<EVENT
{
  entity: "thermostat",
  event: "temperature-recorded",
  key: "thermostat1",
  meta: {causation: "14rew3494"},
  data:{celsius: 18.5},
  selector: {
    selectorId: "foo",
    mark: "bar"
  }
}
EVENT

Created new event at: https://preview.evently.cloud/selectors/fetch/ijfoij2oip4gj4wd.json
`]

  static flags = {
    ...TokenAwareCommand.flags,
    ...bodyInputHelper.flags,
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(AtomicFact)

    const body = await bodyInputHelper.readJson5(flags)

    const client = initClient(flags.token)

    const appendRes = await client
      .follow('append')
      .follow('atomic')

    const newEventRes = await appendRes.postFollow({
      data: body
    })

    this.log(`Created new event at: ${newEventRes.uri}`)

  }

}
