import {Flags} from "@oclif/core"
import {downloadAndValidateLedger} from "../../lib/download"
import {TokenAwareCommand} from "../../lib/token-command"
import { initClient } from '../../lib/client';

export default class Download extends TokenAwareCommand {
  static description = "Download a Ledger"

  static examples = [
    `$ evently ledger:download
Validated 13,438 ledger events.
`]


  static flags = {
    ...TokenAwareCommand.flags,
    file: Flags.string({
      char:         "f",
      description:  "File to download / append Ledger to.",
      required:     true
    }),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Download)

    const client = initClient(flags.token);

    const count = await downloadAndValidateLedger(flags.file)

    const numberFormatter = new Intl.NumberFormat()
    this.log("Validated %s ledger events.", numberFormatter.format(count))
  }
}
