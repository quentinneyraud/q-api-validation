const path = require('path')
const defu = require('defu')
const isPortReachable = require('is-port-reachable')
const getPort = require('get-port')
const { logError } = require('./log')
const { SOCKET_PORTS } = require('../shared')

const DEFAULT_CONFIG = {
  baseUrl: null,
  interactive: {
    port: 5000,
    open: false
  },
  watch: null,
  request: {
    headers: {},
    timeout: 5000
  },
  routes: []
}
const DEFAULT_CONFIG_FILE = path.join(process.cwd(), 'q-api-validation.config.js')

class Config {
  async init ({ configFile, watch, interactive, open, port }) {
    this.configFile = configFile || DEFAULT_CONFIG_FILE
    this.watch = watch
    this.interactive = interactive

    this.parameters = DEFAULT_CONFIG

    if (this.interactive) {
      this.parameters = defu({
        interactive: {
          port,
          open
        }
      }, this.parameters)
    }

    await this.loadConfigFile()

    if (this.interactive) {
      this.parameters.interactive.socketPort = await getPort({
        port: SOCKET_PORTS
      })
      await this.validatePort()
    }
  }

  async validatePort () {
    const reachable = await isPortReachable(this.parameters.interactive.port)

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

      this.parameters = defu(configFile, this.parameters)
    } catch (e) {
      if (e.code === 'ENOENT') logError(`Cannot find config file : ${this.configFile}`)
    }
  }
}

module.exports = new Config()
