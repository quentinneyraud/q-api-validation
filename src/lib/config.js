const path = require('path')
const isPortReachable = require('is-port-reachable')
const getPort = require('get-port')
const { logError } = require('./log')
const { SOCKET_PORTS } = require('../SharedConfig')

const DEFAULT_CONFIG_FILE = path.join(process.cwd(), 'q-api-validation.config.js')
const DEFAULT_PORT = 5000

class Config {
  async init ({ command, configFile, openBrowser, port }) {
    this.command = command
    this.configFile = configFile || DEFAULT_CONFIG_FILE
    this.openBrowser = openBrowser || false
    this.port = port || DEFAULT_PORT

    this.socketPort = await getPort({
      port: SOCKET_PORTS
    })
    await this.loadConfigFile()
    await this.validatePort()
  }

  async validatePort () {
    const reachable = await isPortReachable(this.port)

    if (!reachable) {
      this.port = await getPort({
        port: getPort.makeRange(this.port, this.port + 50)
      })
    }
  }

  async loadConfigFile () {
    try {
      // eslint-disable-next-line
      const configFile = __non_webpack_require__(this.configFile)

      this.baseUrl = configFile.baseUrl || ''
      this.defaultTimeout = configFile.timeout || null
      this.defaultHeaders = configFile.headers || {}
      this.routes = configFile.routes || []
      this.requestParameters = {
        method: 'GET',
        ...configFile.requestParameters
      }
    } catch (e) {
      if (e.code === 'ENOENT') logError(`Cannot find config file : ${this.configFile}`)
    }
  }
}

module.exports = new Config()
