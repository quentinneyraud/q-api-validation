import Vue from 'vue/dist/vue.common'
import './index.styl'

new Vue({
  el: '#app',
  data: {
    routes: []
  },
  mounted () {
    this.socketClient = new WebSocket(`ws://${location.hostname}:8080`)
    this.socketClient.onmessage = this.onMessage
  },
  methods: {
    onMessage (event) {
      const { type, datas } = JSON.parse(event.data)

      console.log(datas)
      if (type === 'datas') {
        this.routes = datas.routes
      }
    }
  }
})
