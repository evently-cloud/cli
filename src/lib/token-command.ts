import {Command, Flags} from "@oclif/core"
import {CLIError} from "@oclif/core/lib/parser/errors"


const NOT_SET = "NOT-SET"

export abstract class TokenAwareCommand extends Command {
  static flags = {
    token: Flags.string({
      char:         "t",
      description:  "Access token for your ledger.",
      env:          "EVENTLY_TOKEN",
      required:     false,
      default:      NOT_SET
    }),
  }

  static validateToken(token: string | undefined): string {
    if (token === NOT_SET || !token) {
      throw new CLIError("missing access token", {
        message: "Evently access token missing.",
        suggestions: [
          "Pass as a flag (--token or -t)",
          `Set the ${this.flags.token.env} environment variable to the access token.`
        ]
      })
    }
    return token
  }
}