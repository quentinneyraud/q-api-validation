const WebSocket = require('ws')
const events = require('events')
const Config = require('../lib/Config')
const { NEW_SOCKET_CLIENT } = require('../shared')

class SocketServer extends events.EventEmitter {
  start () {
    this.instance = new WebSocket.Server({
      port: Config.socketPort
    })
    this.instance.on('open', _ => {
      this.ready = true
    })

    this.client = null

    this.instance.on('connection', this.onConnection.bind(this))
  }

  onConnection (client) {
    this.client = client

    this.client.on('message', this.onMessage.bind(this))

    this.emit(NEW_SOCKET_CLIENT)
  }

  onMessage (socketContent) {
    const { type, datas } = JSON.parse(socketContent)

    this.emit(type, datas)
  }

  emit (type, datas) {
    if (!this.ready) return

    const content = {
      type,
      datas
    }

    this.client.send(JSON.stringify(content))
  }
}

module.exports = new SocketServer()
