const path = require('path')
const axios = require('axios')
const Config = require('./Config')
const Validator = require('jsonschema').Validator
const { Events, ROUTE_STATE_CHANGED } = require('./Events')

module.exports = class Route {
  constructor ({ url, method, datas, schema, refs, requestParameters }) {
    this.uid = Math.random().toString(36).substr(2, 9)
    this.url = url
    this.method = method
    this.datas = datas
    this.schema = schema
    this.refs = refs

    this.fullUrl = Config.baseUrl + this.url
    this.requestParameters = {
      ...Config.requestParameters,
      ...requestParameters,
      url: this.fullUrl
    }

    this.state = {}
    this.resetState()

    this.createValidator()
  }

  createValidator () {
    this.validator = new Validator()

    Object.entries(this.refs)
      .forEach(([schemaName, refSchema]) => {
        this.validator.addSchema(schemaName, path.resolve(process.cwd(), refSchema))
      })
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
    this.state = {
      ...this.state,
      ...newState
    }

    Events.emit(ROUTE_STATE_CHANGED, this.state)
  }

  async validate () {
    this.resetState()

    try {
      const response = await axios.request({
        ...this.requestParameters
      })

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
