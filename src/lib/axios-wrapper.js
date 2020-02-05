const axios = require('axios')

module.exports = ({ baseUrl, headers, timeout }) => {
  return axios.create({
    baseUrl,
    headers,
    timeout
  })
}
