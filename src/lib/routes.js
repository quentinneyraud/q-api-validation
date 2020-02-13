const { NEW_SOCKET_CLIENT, INIT_ROUTES, VALIDATE_ROUTE, VALIDATE_ALL_ROUTES } = require('../shared')
const Route = require('./Route')
const socketServer = require('../server/SocketServer')

class Routes {
  constructor () {
    this.bindMethods()
  }

  createRoutes (routesConfigs) {
    this.routes = routesConfigs.map((routeConfig, index) => {
      return new Route({
        id: index,
        ...routeConfig
      })
    })

    socketServer.on(NEW_SOCKET_CLIENT, this.onNewSocketClient)
    socketServer.on(VALIDATE_ALL_ROUTES, this.validateAllRoutes)
    socketServer.on(VALIDATE_ROUTE, this.validateRoute)
  }

  bindMethods () {
    this.onNewSocketClient = this.onNewSocketClient.bind(this)
    this.validateAllRoutes = this.validateAllRoutes.bind(this)
    this.validateRoute = this.validateRoute.bind(this)
  }

  onNewSocketClient () {
    socketServer.emit(INIT_ROUTES, this.getAllRoutesStates())
  }

  getAllRoutesStates () {
    return this.routes.map(route => route.state)
  }

  getRouteById (uid) {
    return this.routes.find(route => route.uid === uid)
  }

  validateRoute ({ uid }) {
    if (!uid) return

    const route = this.getRouteById(uid)

    if (!route) return

    route.validate()
  }

  validateAllRoutes () {
    this.routes.forEach(route => route.validate())
  }
}

module.exports = new Routes()
