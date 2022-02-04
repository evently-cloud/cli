Evently Command Line Interface
=================

This package contains the source code for the evently command line interface. The commands use the Evently REST API directly and provide convenient access to the ledger’s contents.

The CLI’s bin name is `evently` and can be used from your terminal. To learn more about the available commands, run the `help` command:

```shell
$ evently help
```

### Access Token

Most evently commands will need the API access token in order to function. This can be passed to the command as an environment variable or as a command flag.

##### Environment variable: `EVENTLY_TOKEN`

This is the most convenient approach as the CLI will reuse it for every command. Consult your shell to learn how to set this up, but generally it will look like this:

```sh
export EVENTLY_TOKEN="your-token-here"
```

##### CLI flag: `--token` or `-t`

Useful for scripts or for accessing more than one ledger in a session.

`$ evently -t your-token-here`

The flag will override the environment variable, if set, for this command.

## Commands

### `ledger`

This command provides the ledger’s name and current event count. 

### `ledger:download`

##### Flags

| Flag             | Purpose                                                      | Required |
| ---------------- | ------------------------------------------------------------ | -------- |
| `--file` or `-f` | The path to the ledger download file. The file format is [NDJSON](http://ndjson.org), so the file name can have the `.ndjson` suffix. | Yes      |

You can use the `ledgers:download` command to download the contents of a ledger to a local file. This command will either create a new file, or validate an existing ledger download file before downloading the new events from the ledger and appending them to this file. The command keeps your local ledger copy up-to-date with the Evently cloud’s ledger for you to use as you wish. 

## CLI Updates

This CLI is self-updating, so once you have installed it, the tool itself can be updated without downloading an installer again.

To update, run this command:

`$ evently update`
