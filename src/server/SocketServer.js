const WebSocket = require('ws')
const EventEmitter = require('events')
const Config = require('../lib/config')

module.exports = class SocketServer extends EventEmitter {
  constructor () {
    super()

    this.instance = new WebSocket.Server({
      port: Config.socketPort
    })
    this.client = null

    this.instance.on('connection', this.onConnection.bind(this))
  }

  onConnection (client) {
    this.client = client

    this.client.on('message', this.onMessage.bind(this))

    this.emit('connection')
  }

  onMessage (datas) {
    this.emit('message', datas)
    console.log('message', datas)
  }

  send (type, datas) {
    if (!this.client) return

    const content = {
      type,
      datas
    }

    this.instance.clients.forEach(client => {
      client.send(JSON.stringify(content))
    })
  }
}
