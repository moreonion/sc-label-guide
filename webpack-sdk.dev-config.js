const merge = require('webpack-merge')
const common = require('./webpack-sdk.common-config.js')

module.exports = merge(common, {
  performance: {hints: false},
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './',
    publicPath: '/sdk-dist/'
  }
})
