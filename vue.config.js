
'use strict'
const path = require('path')
const port = 9527 // dev port
const routerData = require('./router.json')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  devServer: {
    before (app) {
      app.get('/dev-api/routerData', function (req, res) {
        res.json({
          code: 200,
          data: routerData
        })
      })
    },
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
