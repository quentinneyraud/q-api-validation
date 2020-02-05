module.exports = {
  baseUrl: 'http://www.btp-cfa.test/wp-json/api',
  routes: [{
    url: '/formations',
    schema: './validations/formations.json',
    refs: {
      Address: './validations/refs/address.json'
    }
  }]
}
