const open = require('open')

const SocketServer = require('./server/SocketServer')
const Config = require('./lib/Config')
const Routes = require('./lib/routes')
const Server = require('./server/index')
const { Events, VALIDATE_ALL } = require('./Events')

module.exports = async options => {
  // init config
  await Config.init(options)

  // init all routes
  new Routes(Config.routes)

  // validate all routes
  Events.emit(VALIDATE_ALL)

  if (Config.command === 'run') {
    // console.table(all)
  } else if (Config.command === 'interactive') {
    const server = new Server()
    server.start()

    new SocketServer()

    console.log(`Server listening at http://localhost:${Config.port}`)

    if (Config.openBrowser) {
      open(`http://localhost:${Config.port}`)
    }
  }
}
