const path = require('path')
const ora = require('ora')
const axios = require('axios')
const Config = require('./Config')
const Validator = require('jsonschema').Validator

module.exports = class Route {
  constructor ({ id, url, method, datas, schema, refs, requestParameters }) {
    this.id = id
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
    this.spinner = ora()
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
      id: this.id,
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

    // this.emit('route_state_updated', {
    //   id: this.id,
    //   state: this.state
    // })
  }

  async validate () {
    this.spinner.start('Request...')
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

      this.spinner.text = 'Validate JSON response...'
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

    if (this.state.hasError) {
      this.spinner.fail(`${this.method} ${this.fullUrl} : ${this.state.message}`)
    } else {
      this.spinner.succeed(`${this.method} ${this.fullUrl} : ${this.state.message}`)
    }

    return this.state
  }
}
