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

  // validate all routes
  Routes.validateAllRoutes()

  // Run command
  const run = () => {
    // console.table(all)
  }

  // Interactive command
  const interactive = () => {
    const httpServer = new HttpServer()
    httpServer.start()

    socketServer.start()

    if (Config.openBrowser) {
      open(`http://localhost:${Config.port}`)
    }
  }

  if (Config.fromCli) {
    // CLI execution, execute appropriate command
    if (Config.command === 'run') run()
    if (Config.command === 'interactive') interactive()
  } else {
    // JS file execution, return commands
    return {
      run,
      interactive
    }
  }
}
