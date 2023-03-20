import {TokenAwareCommand} from "../../lib/token-command"
import { initClient } from '../../lib/client';

export default class Ledger extends TokenAwareCommand {
  static description = "Ledger commands"

  static examples = [
    `$ evently ledger
name: your-ledger-name, events: count
`
  ]

  async run(): Promise<void> {
    const {flags} = await this.parse(Ledger);

    const client = initClient(flags.token);

    const ledgersRes = await client.follow('ledgers');
    const { data } = await ledgersRes.get();

    const numberFormatter = new Intl.NumberFormat();
    this.log(`name: '${data.name}', events: ${numberFormatter.format(data.count)}`)

  }
}
