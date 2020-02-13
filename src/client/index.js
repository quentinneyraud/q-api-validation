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

    this.socketClient.onmessage = this.onSocketMessage
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
      this.emit(VALIDATE_ALL_ROUTE)
    },
    validateRoute (uid) {
      console.log('validate', uid)
      this.emit(VALIDATE_ROUTE, { uid })
    },
    emit (type, datas = null) {
      const content = {
        type,
        datas
      }

      this.socketClient.emit(JSON.stringify(content))
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
