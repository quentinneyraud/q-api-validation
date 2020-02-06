const WebSocket = require('ws')
const Config = require('../lib/Config')
const { Events, NEW_SOCKET_CLIENT, SOCKET_CLIENT_MESSAGE } = require('../Events')

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

    Events.emit(NEW_SOCKET_CLIENT, {
      client: this.client,
      send: this.send
    })
  }

  onMessage (datas) {
    Events.emit(SOCKET_CLIENT_MESSAGE, {
      datas,
      send: this.send
    })
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
