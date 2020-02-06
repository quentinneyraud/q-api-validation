const { Events, NEW_SOCKET_CLIENT, VALIDATE_ALL } = require('../Events')
const { INIT_ROUTES } = require('../SharedConfig')
const Route = require('./Route')

module.exports = class Routes {
  constructor (routes) {
    this.bindMethods()

    this.routes = routes.map((routeConfig, index) => {
      return new Route({
        id: index,
        ...routeConfig
      })
    })

    Events.on(NEW_SOCKET_CLIENT, this.onNewSocketClient)
    Events.on(VALIDATE_ALL, this.validateAllRoutes)
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
