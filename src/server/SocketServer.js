const WebSocket = require('ws')
const Event = require('../utils/Event')

module.exports = class SocketServer extends Event {
  constructor () {
    super()

    this.instance = new WebSocket.Server({
      port: 8080
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
