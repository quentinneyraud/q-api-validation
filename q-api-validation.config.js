module.exports = {
  baseUrl: 'http://www.btp-cfa.test/wp-json/api',
  interactive: {
    port: 4000
  },
  requestParameters: {
    headers: {},
    timeout: 5000
  },
  routes: [{
    url: '/formations',
    requestParameters: {
      headers: {},
      timeout: 2000
    },
    schema: './validations/formations.json',
    refs: {
      Address: './validations/refs/address.json'
    }
  }]
}
