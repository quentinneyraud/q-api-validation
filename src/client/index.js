import Vue from 'vue/dist/vue.common'
import './index.styl'
import { SOCKET_PORTS, INIT_ROUTES, VALIDATE_ROUTE, VALIDATE_ALL_ROUTE } from '../shared'

new Vue({
  el: '#app',
  data: {
    routes: []
  },
  mounted () {
    this.socketClient = this.getSocketClient()

    if (!this.socketClient) return

    this.socketClient.onmessage = this.onMessage
  },
  methods: {
    getSocketClient () {
      let client = null
      SOCKET_PORTS.some(port => {
        try {
          client = new WebSocket(`ws://${location.hostname}:${port}`)

          return !!client
        } catch (err) {
          console.log('error')
        }
      })

      return client
    },
    validateAllRoutes () {
      this.send(VALIDATE_ALL_ROUTE)
    },
    validateRoute (uid) {
      this.send(VALIDATE_ROUTE, { uid })
    },
    send (type, datas = null) {
      console.log('send', { type, datas })
      const content = {
        type,
        datas
      }

      console.log(this.socketClient)
      this.socketClient.clients.forEach(client => {
        client.send(JSON.stringify(content))
      })
    },
    onSocketMessage (event) {
      console.log('onSocketMessage', event)
      const { type, datas } = JSON.parse(event.data)

      if (type === INIT_ROUTES) {
        this.routes = datas.map(route => ({
          ...route,
          expanded: false
        }))
      }
    }
  }
})
