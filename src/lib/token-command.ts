import {Command, Flags} from '@oclif/core'
import {CLIError} from '@oclif/core/lib/parser/errors'

const NOT_SET = 'NOT-SET'

export abstract class TokenAwareCommand extends Command {
  static flags = {
    token: Flags.string({
      char:         't',
      description:  'Access token for your ledger.',
      env:          'EVENTLY_TOKEN',
      required:     false,
      default:      NOT_SET
    }),
  }

}
