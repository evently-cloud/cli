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
* [`evently ledger`](#evently-ledger)
* [`evently ledger:download`](#evently-ledgerdownload)
* [`evently ledger:reset`](#evently-ledgerreset)
* [`evently registry:new`](#evently-registrynew)
* [`evently update [CHANNEL]`](#evently-update-channel)

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

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v2.2.10/src/commands/commands.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.5/src/commands/help.ts)_

## `evently ledger`

Ledger commands

```
USAGE
  $ evently ledger [-t <value>]

FLAGS
  -t, --token=<value>  [default: NOT-SET] Access token for your ledger.

DESCRIPTION
  Ledger commands

EXAMPLES
  $ evently ledger
  name: your-ledger-name, events: count
```

_See code: [dist/commands/ledger/index.ts](https://github.com/evently-cloud/cli/blob/v0.1.0/dist/commands/ledger/index.ts)_

## `evently ledger:download`

Download a Ledger

```
USAGE
  $ evently ledger:download -f <value> [-t <value>]

FLAGS
  -f, --file=<value>   (required) File to download / append Ledger to.
  -t, --token=<value>  [default: NOT-SET] Access token for your ledger.

DESCRIPTION
  Download a Ledger

EXAMPLES
  $ evently ledger:download
  Validated 13,438 ledger events.
```

_See code: [dist/commands/ledger/download.ts](https://github.com/evently-cloud/cli/blob/v0.1.0/dist/commands/ledger/download.ts)_

## `evently ledger:reset`

Reset a Ledger

```
USAGE
  $ evently ledger:reset [-t <value>] [-a <value>]

FLAGS
  -a, --after=<value>  Ledger Mark / Event ID to reset ledger after.
  -t, --token=<value>  [default: NOT-SET] Access token for your ledger.

DESCRIPTION
  Reset a Ledger

EXAMPLES
  $ evently ledger:reset
  Reset ledger fully.
```

_See code: [dist/commands/ledger/reset.ts](https://github.com/evently-cloud/cli/blob/v0.1.0/dist/commands/ledger/reset.ts)_

## `evently registry:new`

```
USAGE
  $ evently registry:new -e <value> -n <value> [-t <value>]

FLAGS
  -e, --event=<value>   (required) Event name
  -n, --entity=<value>  (required) Entity name
  -t, --token=<value>   [default: NOT-SET] Access token for your ledger.

EXAMPLES
  $ evently registry:add
  Created a new entity event at https://preview.evently.cloud/registry/[entity]/[event]
```

_See code: [dist/commands/registry/new.ts](https://github.com/evently-cloud/cli/blob/v0.1.0/dist/commands/registry/new.ts)_

## `evently update [CHANNEL]`

update the evently CLI

```
USAGE
  $ evently update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  update the evently CLI

EXAMPLES
  Update to the stable channel:

    $ evently update stable

  Update to a specific version:

    $ evently update --version 1.0.0

  Interactively select version:

    $ evently update --interactive

  See available versions:

    $ evently update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.1.5/src/commands/update.ts)_
<!-- commandsstop -->
