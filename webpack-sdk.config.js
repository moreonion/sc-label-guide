const merge = require('webpack-merge')
const webpack = require('webpack')

const common = require('./webpack-sdk.common-config.js')

module.exports = merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production')}
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {warnings: false}
    })
  ],
  devtool: '#source-map',
  performance: {hints: 'warning'}
})
