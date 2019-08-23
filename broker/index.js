'use strict'

import mosca from 'mosca'

import Config from '../config'

const server = new mosca.Server({
  port: Config.mosca.port,
  backend: Config.mosca.ascoltatore
})

server.on('clientConnected', (client) => {
  console.log('client connected', client.id)
})

// fired when a message is received
server.on('published', (packet, client) => {
  console.log('Published', packet.payload.toString())
  // {"clientId":"mqttjs_02fea7b4","topic":"/tips"}
  // console.log('>>>packet', packet); //{"clientId":"mqttjs_02fea7b4","topic":"/tips"}
});

// fired when the mqtt server is ready
server.on('ready', () => {
  console.log('Mosca server is up and running')
})