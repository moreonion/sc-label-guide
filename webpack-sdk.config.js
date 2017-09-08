const merge = require('webpack-merge')
const webpack = require('webpack')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')

const common = require('./webpack-sdk.common-config.js')

const pkg = require('./sdk/package.json')

module.exports = merge(common, {
  plugins: [
    new webpack.BannerPlugin(`${pkg.name} v${pkg.version}, Copyright (c) ${new Date().getFullYear()}`),
    // new ExtractTextPlugin("sdk.css"),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {warnings: false}
    }),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')}
    })
  ],
  devtool: 'source-map',
  performance: {hints: 'warning'}
})
