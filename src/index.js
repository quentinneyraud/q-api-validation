const open = require('open')
const Config = require('./lib/config')
const getAxiosWrapper = require('./lib/axios-wrapper')
const Route = require('./lib/Route')
const Server = require('./server/index')
require('./server/socket')

let routes = []

module.exports = async options => {
  Config.init(options)
  await Config.loadConfigFile()

  const axiosWrapper = getAxiosWrapper({
    baseUrl: Config.baseUrl,
    timeout: Config.defaultTimeout,
    headers: Config.defaultHeaders
  })

  routes = Config.routes.map(route => new Route(Config, axiosWrapper, route))

  if (Config.command === 'run') {
    const promises = routes.map(route => route.execute())

    const all = await Promise.all(promises)

    console.table(all)
  } else if (Config.command === 'interactive') {
    const server = new Server({
      port: Config.port
    })

    server.start()

    if (Config.openBrowser) {
      open(`http://localhost:${Config.port}`)
    }
  }
}
