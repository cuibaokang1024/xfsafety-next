
'use strict'
const path = require('path')
const port = 9527 // dev port
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  devServer: {
    before (app) {},
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
