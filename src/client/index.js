import Vue from 'vue/dist/vue.common'
import './index.styl'
import { SOCKET_PORTS, INIT_ROUTES } from '../SharedConfig'

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
    onMessage (event) {
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
