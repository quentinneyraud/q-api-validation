const WebSocket = require('ws')
const Config = require('../lib/Config')
const { Events, NEW_SOCKET_CLIENT } = require('../lib/Events')
const { ROUTE_STATE_CHANGED, VALIDATE_ALL_ROUTE, VALIDATE_ROUTE } = require('../shared')

module.exports = class SocketServer {
  constructor () {
    this.bindMethods()
    this.instance = new WebSocket.Server({
      port: Config.socketPort
    })
    this.client = null

    this.instance.on('connection', this.onConnection.bind(this))
  }

  bindMethods () {
    this.send = this.send.bind(this)
  }

  onConnection (client) {
    this.client = client

    this.client.on('message', this.onMessage.bind(this))
  }

  onMessage (socketContent) {
    const { type, datas } = socketContent

    console.log({ type, datas })
  }

  send (type, datas) {
    const content = {
      type,
      datas
    }

    this.instance.clients.forEach(client => {
      client.send(JSON.stringify(content))
    })
  }
}
