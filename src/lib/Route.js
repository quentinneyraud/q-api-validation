const path = require('path')
const ora = require('ora')
const Validator = require('jsonschema').Validator

module.exports = class Route {
  constructor (config, axiosWrapper, { url, method, datas, schema, refs }) {
    this.config = config
    this.axiosWrapper = axiosWrapper
    this.url = url
    this.method = method
    this.datas = datas
    this.schema = schema
    this.refs = refs

    this.fullUrl = this.config.baseUrl + this.url

    this.state = {
      hasError: false,
      status: 200,
      statusText: 'OK',
      message: 'All validations passed',
      response: [],
      errors: []
    }

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

  async execute () {
    this.spinner.start('Request...')

    try {
      const result = await this.axiosWrapper.get(this.fullUrl)

      this.state.hasError = false
      this.spinner.text = 'Validate JSON response...'
      this.state.status = result.status
    } catch (error) {
      this.state.hasError = true
      this.state.status = error.response.status
      this.state.statusText = error.response.statusText
      this.state.message = 'Error'
    }

    if (this.state.hasError) {
      this.spinner.fail(`${this.method} ${this.fullUrl} : ${this.state.message}`)
    } else {
      this.spinner.succeed(`${this.method} ${this.fullUrl} : ${this.state.message}`)
    }
    return {
      ...this.state,
      url: this.fullUrl,
      datas: this.datas,
      method: this.method
    }
  }
}
