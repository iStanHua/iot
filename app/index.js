'use strict'

import mqtt from 'mqtt'

import Config from '../config'

const client = mqtt.connect(`mqtt://localhost:${Config.mosca.port}`)

client.on('connect', () => {
  console.log('>>> connected')
  setInterval(() => {
    client.publish('/temperature', '38')
  }, 3000)
})

client.on('message', (topic, message) => {
  console.log(message.toString())
})