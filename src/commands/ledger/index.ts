import {sendToEvently} from "../../lib/evently-connect"
import {TokenAwareCommand} from "../../lib/token-command"


export default class Ledger extends TokenAwareCommand {
  static description = "Ledger commands"

  static examples = [
    `$ evently ledger
name: your-ledger-name, events: count
`
  ]

  async run(): Promise<void> {
    const {flags} = await this.parse(Ledger)

    const token = TokenAwareCommand.validateToken(flags.token)

    const result = await sendToEvently(token, "/ledgers")

    if (result.status === 200) {
      const data = await result.json() as any

      const numberFormatter = new Intl.NumberFormat()
      this.log(`name: '${data.name}', events: ${numberFormatter.format(data.count)}`)
    } else {
      const text = await result.text()
      this.error(text)
    }
  }
}
