const events = require('events')

module.exports = {
  Events: new events.EventEmitter(),
  VALIDATE_ALL: Symbol('VALIDATE_ALL'),
  VALIDATE_ROUTE: Symbol('VALIDATE_ROUTE'),
  NEW_SOCKET_CLIENT: Symbol('NEW_SOCKET_CLIENT'),
  SOCKET_CLIENT_MESSAGE: Symbol('SOCKET_CLIENT_MESSAGE')
}
