/* eslint-disable no-unused-vars */

import Vue from 'vue/dist/vue.common'

const app = new Vue({
  el: '#app',
  data: {
    routes: ['Hello Vue!']
  }
})

// let ws = new WebSocket(`ws://${location.hostname}:8080`)

// ws.onerror = function () {
//   console.log('WebSocket error')
// }
// ws.onopen = function () {
//   console.log('WebSocket connection established')
// }
// ws.onclose = function () {
//   console.log('WebSocket connection closed')
//   ws = null
// }
// ws.onmessage = function (datas) {
//   console.log(datas)
// }
