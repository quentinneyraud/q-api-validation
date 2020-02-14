module.exports = {
  baseUrl: 'http://www.btp-cfa.test/wp-json/api',
  interactive: {
    port: 4000
  },
  request: {
    headers: {},
    timeout: 5000
  },
  routes: [{
    url: '/formations',
    method: 'GET',
    headers: {},
    timeout: 2000,
    query: {
      id: 10
    },
    body: {
      test: '5'
    },
    watch: 'src/*',
    poll: 2000,
    extendValidations: ({ validations }) => {
      return [{
        schema: './validations/formations.json',
        refs: {
          Address: './validations/refs/address.json'
        }
      }, validations.is200]
    }
  }]
}
