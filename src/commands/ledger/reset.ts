import {Flags} from "@oclif/core"
import {sendToEvently} from "../../lib/evently-connect"
import {TokenAwareCommand} from "../../lib/token-command"


export default class Reset extends TokenAwareCommand {
  static description = "Reset a Ledger"

  static examples = [
    `$ evently ledger reset
???
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

    const token = TokenAwareCommand.validateToken(flags.token)
    const {after} = flags
    const body = after
      ? `{"after":"${after}"}`
      : "{}"

    const response = await sendToEvently(token, "/ledgers/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body
    })

    if (response.status === 204) {
      const logMsg = after
        ? `after ${after}`
        : "fully"
      this.log("Reset ledger %s. If you have downloaded this ledger, you will need to delete the downloaded file as it may no longer be valid.", logMsg)
    } else {
      const text = await response.text()
      this.error(text)
    }
  }
}
