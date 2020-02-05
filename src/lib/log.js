const chalk = require('chalk')

const logError = str => {
  console.log(chalk.red(str))
  process.exit(2)
}

module.exports = {
  logError
}
