const events = require('events')

module.exports = {
  Events: new events.EventEmitter(),
  VALIDATE_ALL: Symbol('VALIDATE_ALL'),
  VALIDATE_ROUTE: Symbol('VALIDATE_ROUTE'),
  ROUTE_STATE_CHANGED: Symbol('ROUTE_STATE_CHANGED')
}
