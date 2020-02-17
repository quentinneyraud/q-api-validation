const open = require('open')
const chokidar = require('chokidar')

const socketServer = require('./server/SocketServer')
const HttpServer = require('./server/HttpServer')
const Config = require('./lib/Config')
const Routes = require('./lib/Routes')

module.exports = async options => {
  // init config
  await Config.init(options)

  // init all routes
  Routes.createRoutes(Config.parameters.routes)

  // Run command
  const run = () => {
    // validate all routes
    Routes.validateAllRoutes()

    if (Config.watch) {
      chokidar.watch(Config.parameters.watch).on('all', Routes.validateAllRoutes.bind(Routes))
    }

    if (Config.interactive) {
      const httpServer = new HttpServer()
      httpServer.start()

      socketServer.start()

      if (Config.parameters.interactive.open) {
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
