const EventEmitter = require('events')
const Route = require('./Route')

module.exports = class Routes extends EventEmitter {
  constructor (routes) {
    super()

    this.routes = routes.map((routeConfig, index) => {
      return new Route({
        id: index,
        ...routeConfig
      })
    })

    this.on('validate_all_routes', this.validateAllRoutes)
    this.on('validate_route', this.validateRoute)
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
