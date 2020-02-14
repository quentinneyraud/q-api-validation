const open = require('open')

const socketServer = require('./server/SocketServer')
const HttpServer = require('./server/HttpServer')
const Config = require('./lib/Config')
const Routes = require('./lib/Routes')

module.exports = async options => {
  // init config
  await Config.init(options)

  // init all routes
  Routes.createRoutes(Config.routes)

  // Run command
  const run = () => {
    // validate all routes
    Routes.validateAllRoutes()

    if (Config.watch) {
      // new Chokidar()
    }

    if (Config.interactive) {
      const httpServer = new HttpServer()
      httpServer.start()

      socketServer.start()

      if (Config.openBrowser) {
        open(`http://localhost:${Config.port}`)
      }
    } else {
      // console.table(all)
    }
  }

  return {
    run
  }
}
