const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const app = express()
const config = require('./webpack.config.js')
const compiler = webpack(config)

console.log(config.entry)

// 告知 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置。
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      chunks: false,
    },
  })
)

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const router = express.Router()

registerSimpleRouter()

registerBaseRouter()

registerErrorRouter()

registerExtendRouter()

app.use(router)

// 将文件 serve 到 port 3000。
app.listen(3000, function () {
  console.log('http://localhost:3000/\n')
})

function registerSimpleRouter() {
  router.get('/simple/get', function (req, res) {
    res.json({
      msg: 'hello world',
    })
  })
}

function registerBaseRouter() {
  router.get('/base/get', function (req, res) {
    res.json(req.query)
  })

  router.post('/base/post', function (req, res) {
    res.json(req.body)
  })

  router.post('/base/buffer', function (req, res) {
    let msg = []
    req.on('data', (chunk) => {
      if (chunk) {
        msg.push(chunk)
      }
    })
    req.on('end', () => {
      let buf = Buffer.concat(msg)
      res.json(buf.toJSON())
    })
  })
}

function registerErrorRouter() {
  router.get('/error/get', function (req, res) {
    if (Math.random() > 0.5) {
      res.json({
        msg: 'hello world',
      })
    } else {
      res.status(500)
      res.end()
    }
  })
  router.get('/error/timeout', function (req, res) {
    setTimeout(() => {
      res.json({
        msg: 'hello world',
      })
    }, 3000)
  })
}

function registerExtendRouter() {
  router.get('/extend/get', function (req, res) {
    res.json({
      msg: 'hello world',
    })
  })

  router.options('/extend/options', function (req, res) {
    res.end()
  })

  router.head('/extend/head', function (req, res) {
    res.end()
  })

  router.delete('/extend/delete', function (req, res) {
    res.end()
  })

  router.post('/extend/post', function (req, res) {
    res.json(req.body)
  })

  router.put('/extend/put', function (req, res) {
    res.json(req.body)
  })

  router.patch('/extend/patch', function (req, res) {
    res.json(req.body)
  })

  // 响应数据支持泛型接口
  router.get('/extend/user', function (req, res) {
    res.json({
      code: 0,
      message: 'ok',
      result: {
        name: 'Alice',
        age: 18,
      },
    })
  })
}
