const { Events, NEW_SOCKET_CLIENT, VALIDATE_ALL, VALIDATE_ROUTE } = require('./Events')
const { INIT_ROUTES } = require('../shared')
const Route = require('./Route')

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

    Events.on(NEW_SOCKET_CLIENT, this.onNewSocketClient)
    Events.on(VALIDATE_ALL, this.validateAllRoutes)
    Events.on(VALIDATE_ROUTE, this.validateRoute)
  }

  bindMethods () {
    this.onNewSocketClient = this.onNewSocketClient.bind(this)
    this.validateAllRoutes = this.validateAllRoutes.bind(this)
  }

  onNewSocketClient ({ send }) {
    send(INIT_ROUTES, this.getAllRoutesStates())
  }

  getAllRoutesStates () {
    return this.routes.map(route => route.state)
  }

  getRouteById (id) {
    return this.routes.find(route => route.id === id)
  }

  validateRoute (datas) {
    const routeId = datas.routeId

    if (!routeId) return

    const route = this.getRouteById(routeId)

    if (!route) return

    route.validate()
  }

  validateAllRoutes () {
    this.routes.forEach(route => route.validate())
  }
}

module.exports = new Routes()
