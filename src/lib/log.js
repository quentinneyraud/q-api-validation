const chalk = require('chalk')
const boxen = require('boxen')
const { name, version } = require('../../package.json')

const logError = str => {
  console.log(chalk.red(str))
  process.exit(2)
}

const logIntro = (text) => {
  const log = `${name} ${version}\n\n${text}`

  console.log(boxen(log, {
    margin: {
      top: 2,
      left: 5
    },
    padding: 2,
    borderColor: 'green',
    borderStyle: 'round',
    align: 'center'
  }))
}

module.exports = {
  logError,
  logIntro
}
