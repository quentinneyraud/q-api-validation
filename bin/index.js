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
      --config, -c  Specify configuration file
      --watch, -w  Watch source files and re-run validations
      --interactive, -i  Interactive UI to validate routes and show output
      --open, -o  Interactive mode - open default browser
      --port, -p  Interactive mode - UI server port

    Examples
      $ q-api-validate run
      $ q-api-validate run --config ./custom-config.js
      $ q-api-validate run --watch
      $ q-api-validate run --interactive --port 5000 --open
`, {
  flags: {
    config: {
      type: 'string',
      alias: 'c'
    },
    watch: {
      type: 'boolean',
      alias: 'w'
    },
    interactive: {
      type: 'boolean',
      alias: 'i'
    },
    open: {
      type: 'boolean',
      alias: 'o'
    },
    port: {
      type: 'number',
      alias: 'p'
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
if (cliExecution.input[0] !== 'run') {
  cliExecution.showHelp()
}

// const [_, ...files] = cliExecution.input

QApiValidation({
  fromCli: true,
  // files,
  configFile: cliExecution.unnormalizedFlags.config,
  watch: cliExecution.unnormalizedFlags.watch,
  interactive: cliExecution.unnormalizedFlags.interactive,
  openBrowser: cliExecution.unnormalizedFlags.open,
  port: cliExecution.unnormalizedFlags.port
})
  .then(({ run }) => {
    run()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
