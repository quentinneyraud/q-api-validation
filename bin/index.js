#!/usr/bin/env node
const QApiValidation = require('../build/q-api-validation.js')

const meow = require('meow')
const COMMANDS = ['run', 'interactive']

const cliExecution = meow(`
    Usage
      $ q-api-validate command

    Commands
      run  Run tests and exit
      interactive  Run tests in browser

    Options
      --open, -o  Open default browser
      --port, -p  Interactive mode port
      --config, -c  Specify configuration file

    Examples
      $ q-api-validate run
      $ q-api-validate run --config ./custom-config.js
      $ q-api-validate interactive --port 5000
`, {
  flags: {
    open: {
      type: 'boolean',
      alias: 'o'
    },
    port: {
      type: 'number',
      alias: 'p'
    },
    config: {
      type: 'string',
      alias: 'c'
    }
  }
})

// Show help if -h flag is present
if (cliExecution.flags.h) {
  cliExecution.showHelp()
}

// Show version if -v flag is present
if (cliExecution.flags.v) {
  cliExecution.showVersion()
}

// Show help on unknown command
const command = COMMANDS.indexOf(cliExecution.input[0]) > -1 ? cliExecution.input[0] : null
if (!command) {
  cliExecution.showHelp()
}

const [_, ...files] = cliExecution.input

QApiValidation({
  fromCli: true,
  command,
  files,
  configFile: cliExecution.unnormalizedFlags.config,
  openBrowser: cliExecution.unnormalizedFlags.open,
  port: cliExecution.unnormalizedFlags.port
})
