const SocketServer = require('./server/SocketServer')
const open = require('open')
const Config = require('./lib/config')
const Routes = require('./lib/routes')
const Server = require('./server/index')

module.exports = async options => {
  await Config.init(options)

  const routes = new Routes(Config.routes)

  routes.validateAllRoutes()

  if (Config.command === 'run') {
    // console.table(all)
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
