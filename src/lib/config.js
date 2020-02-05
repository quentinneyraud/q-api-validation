const path = require('path')
const { logError } = require('./log')

const DEFAULT_CONFIG_FILE = path.join(process.cwd(), 'q-api-validation.config.js')
const DEFAULT_PORT = 5000

class Config {
  init ({ command, files, configFile, openBrowser, port }) {
    this.command = command
    this.files = files
    this.configFile = configFile || DEFAULT_CONFIG_FILE
    this.openBrowser = openBrowser || false
    this.port = port || DEFAULT_PORT
  }

  async loadConfigFile () {
    try {
      // eslint-disable-next-line
      const configFile = __non_webpack_require__(this.configFile)
      this.baseUrl = configFile.baseUrl || ''
      this.defaultTimeout = configFile.timeout || null
      this.defaultHeaders = configFile.headers || {}
      this.routes = configFile.routes || []
    } catch (e) {
      if (e.code === 'ENOENT') logError(`Cannot find config file : ${this.configFile}`)
    }
  }
}

module.exports = new Config()
