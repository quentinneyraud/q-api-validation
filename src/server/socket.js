const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', ws => {
  console.log('connection')

  ws.on('message', message => {
    console.log('received: %s', message)
  })

  ws.send('something')
})
