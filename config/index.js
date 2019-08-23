'use strict'

export default {
  appKey: 'SESSION_STANHUA',
  server: {
    host: 'localhost',
    port: 8088
  },
  mosca: {
    port: 8090,
    ascoltatore: {
      //using ascoltatore
      // type: 'mongo',
      // url: 'mongodb://localhost:27017/mqtt',
      // pubsubCollection: 'ascoltatori',
      // mongo: {}
    }
  }
}