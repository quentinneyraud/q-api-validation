const SocketServer = require('./server/SocketServer')
const open = require('open')
const Config = require('./lib/config')
const Route = require('./lib/Route')
const Server = require('./server/index')

let routes = []

module.exports = async options => {
  Config.init(options)
  await Config.loadConfigFile()

  routes = Config.routes.map(route => new Route(route))
  const promises = routes.map(route => route.execute())
  const all = await Promise.all(promises)

  if (Config.command === 'run') {
    console.table(all)
  } else if (Config.command === 'interactive') {
    const server = new Server({
      port: Config.port
    })
    server.start()

    const socketServer = new SocketServer()

    socketServer.on('connection', _ => {
      socketServer.send('datas', {
        routes: all
      })
    })

    if (Config.openBrowser) {
      open(`http://localhost:${Config.port}`)
    }
  }
}
