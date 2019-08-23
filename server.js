'use strict'

require('babel-register')({
  presets: ['env'],
  plugins: [
    'transform-runtime'
  ]
})

module.exports = require('./server/index.js')