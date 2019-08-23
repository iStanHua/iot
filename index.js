'use strict'

import Koa from 'koa'
import helmet from 'koa-helmet'
import bodyparser from 'koa-bodyparser'
import json from 'koa-json'
import cors from 'koa-cors'
import favicon from 'koa-favicon'
import Static from 'koa-static'
import convert from 'koa-convert'
import log4js from 'log4js'
import mqtt from 'mqtt'

import Config from './config'

const app = new Koa()

app.keys = [Config.appKey]

// 解析请求体
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text', 'html']
}))
app.use(helmet())
app.use(json())
app.use(convert(cors()))
app.use(convert(favicon(__dirname + '/public/logo.png')))
app.use(convert(Static(__dirname + '/public')))


app.use(async (ctx, next) => {
  if (!ctx.method === 'GET' && !ctx.method === 'POST') {
    ctx.status = 200
  }
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.error(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.context.onerror = function (e) {
  this.app.emit('error', e, this)
  this.res.end({ code: 500, data: '', msg: '内部服务器错误' })
}

log4js.configure({
  appenders: {
    file: {
      type: 'dateFile',
      filename: __dirname + '/logs/error',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      category: 'logger'
    }
  },
  categories: {
    default: {
      appenders: ['file'],
      level: 'debug'
    }
  }
})

const log = log4js.getLogger('logger')

app.on('error', (err, ctx) => {
  if (err) log.error(err)
})

app.listen(Config.server.port, () => {
  console.log(`Listening on http://${Config.server.host}:${Config.server.port}`)
})


let msg = { temperature: '-', tips: '' }

app.use(ctx => {
  ctx.body = `当前温度:${msg.temperature}度\n穿衣提示:${msg.tips}`
})

const client = mqtt.connect(`mqtt://localhost:${Config.mosca.port}`)

client.on('connect', () => {
  console.log('>>> connected')
  client.subscribe('/tips')
})

client.on('message', (topic, message) => {
  msg = JSON.parse(message.toString())
})

export default app