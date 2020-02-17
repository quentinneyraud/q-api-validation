const path = require('path')
const defu = require('defu')
const axios = require('axios')
const chokidar = require('chokidar')
const Validator = require('jsonschema').Validator

const Config = require('./Config')
const socketServer = require('../server/SocketServer')

const { ROUTE_STATE_CHANGED } = require('../shared')

const DEFAULT_CONFIG = {
  method: 'GET',
  url: '/',
  headers: {},
  body: null,
  datas: null,
  schema: null,
  watch: null
}

module.exports = class Route {
  constructor (options) {
    this.uid = Math.random().toString(36).substr(2, 9)

    this.parameters = defu(options, DEFAULT_CONFIG)

    this.parameters.fullUrl = Config.parameters.baseUrl + this.parameters.url

    this.state = {}
    this.resetState()

    // this.createValidator()
    this.createAxiosInstance()

    if (Config.watch && !!this.watch) {
      this.watchFiles()
    }
  }

  createAxiosInstance () {
    this.axiosInstance = axios.create({
      method: this.parameters.method,
      url: this.parameters.fullUrl,
      timeout: this.parameters.timeout,
      headers: this.parameters.headers,
      params: this.parameters.query,
      data: this.parameters.body
    })
  }

  createValidator () {
    this.validator = new Validator()

    Object.entries(this.refs)
      .forEach(([schemaName, refSchema]) => {
        this.validator.addSchema(schemaName, path.resolve(process.cwd(), refSchema))
      })
  }

  watchFiles () {
    chokidar.watch(this.watch).on('all', this.validate.bind(this))
  }

  resetState () {
    this.updateState({
      uid: this.uid,
      state: 'pending_request',
      request: this.requestParameters,
      response: {
        status: null,
        statusText: null,
        headers: null,
        datas: null
      },
      message: 'All validations passed',
      errors: []
    })
  }

  updateState (newState) {
    this.state = defu(newState, this.state)

    socketServer.emit(ROUTE_STATE_CHANGED, this.state)
  }

  async validate () {
    this.resetState()

    try {
      const response = await this.axiosInstance.request()

      this.updateState({
        state: 'validating_json',
        response: {
          status: response.status,
          statusText: response.statusText,
          datas: response.datas,
          headers: response.headers
        }
      })
    } catch (error) {
      this.updateState({
        state: 'error_request',
        response: {
          status: error.response.status,
          statusText: error.response.statusText,
          datas: [],
          headers: error.response.headers
        }
      })
    }

    return this.state
  }
}
