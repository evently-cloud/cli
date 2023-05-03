Evently Command Line Interface
=================

This package contains the source code for the evently command line interface. The commands use the Evently REST API directly and provide convenient access to the ledger’s contents.

The CLI’s bin name is `evently` and can be used from your terminal. To learn more about the available commands, run the `help` command:

## Installation

The easiest is way to use this is to install it globally with `npm`:

```sh
npm install --global @evently-cloud/cli
```

This requires [Node](https://nodejs.org/en) being installed on your system.

For one-off uses you can also use the `npx` command to use the cli:

```sh
npx @evently-cloud/cli
```

## Authenticating

Most evently commands will need the API access token in order to function.
You can request one via [the form on evently.cloud](https://evently.cloud).

After you obtained the token, you can either pass it to every command using
the `-t` option, but you are recommended to set it via the `EVENTLY_TOKEN`
environment variable instead.

For example, you can add the following statement to your `.bash_profile` or `.zshrc`:

```sh
export EVENTLY_TOKEN="your-token-here"
```

## Commands
<!-- commands -->
* [`evently commands`](#evently-commands)
* [`evently help [COMMANDS]`](#evently-help-commands)

## `evently commands`

list all the commands

```
USAGE
  $ evently commands [--json] [-h] [--hidden] [--tree] [--columns <value> | -x] [--sort <value>] [--filter
    <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)
  --tree             show tree of commands

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  list all the commands
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v2.2.14/src/commands/commands.ts)_

## `evently help [COMMANDS]`

Display help for evently.

```
USAGE
  $ evently help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for evently.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_
<!-- commandsstop -->
