import {Flags} from "@oclif/core"
import {TokenAwareCommand} from "../../lib/token-command"
import {initClient} from '../../lib/client';

export default class Reset extends TokenAwareCommand {
  static description = "Reset a Ledger"

  static examples = [
    `$ evently ledger reset
Reset ledger fully.
`]


  static flags = {
    ...TokenAwareCommand.flags,
    after: Flags.string({
      char:         "a",
      description:  "Ledger Mark / Event ID to reset ledger after.",
      required:     false
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Reset)

    const client = initClient(flags.token);
    const {after} = flags
    const body = after
      ? `{"after":"${after}"}`
      : "{}"

    const resetRes = await client
      .follow('ledgers')
      .follow('reset');

    const response = await resetRes.post({data: body});
    const logMsg = after
      ? `after ${after}`
      : "fully"
    this.log("Reset ledger %s. If you have downloaded this ledger, you will need to delete the downloaded file as it may no longer be valid.", logMsg)

  }

}
