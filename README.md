oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g evently-cli
$ evently COMMAND
running command...
$ evently (--version)
evently-cli/0.0.0 darwin-x64 node-v16.13.1
$ evently --help [COMMAND]
USAGE
  $ evently COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`evently help [COMMAND]`](#evently-help-command)
* [`evently plugins`](#evently-plugins)
* [`evently plugins:inspect PLUGIN...`](#evently-pluginsinspect-plugin)
* [`evently plugins:install PLUGIN...`](#evently-pluginsinstall-plugin)
* [`evently plugins:link PLUGIN`](#evently-pluginslink-plugin)
* [`evently plugins:uninstall PLUGIN...`](#evently-pluginsuninstall-plugin)
* [`evently plugins update`](#evently-plugins-update)

## `evently help [COMMAND]`

Display help for evently.

```
USAGE
  $ evently help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for evently.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `evently plugins`

List installed plugins.

```
USAGE
  $ evently plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ evently plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `evently plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ evently plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ evently plugins:inspect myplugin
```

## `evently plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ evently plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ evently plugins add

EXAMPLES
  $ evently plugins:install myplugin 

  $ evently plugins:install https://github.com/someuser/someplugin

  $ evently plugins:install someuser/someplugin
```

## `evently plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ evently plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ evently plugins:link myplugin
```

## `evently plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ evently plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ evently plugins unlink
  $ evently plugins remove
```

## `evently plugins update`

Update installed plugins.

```
USAGE
  $ evently plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
