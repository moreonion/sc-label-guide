const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const resolve = dir => path.resolve(__dirname, dir)
const resolveArr = dirs => dirs.map(dir => resolve(dir))

module.exports = {
  entry: {
    main: './sdk/src/index.js'
    // polyfill: ['babel-polyfill'],
    // vendor: ['locale', 'locale2', 'vue-i18n', 'i18n-iso-countries', 'qs', 'axios', 'element-ui', 'mo-vue-table', 'lodash.debounce', 'lodash.zip', 'lodash.unzip', 'lodash.reduce']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: resolve('components'),
        exclude: /(node_modules)/,
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.js$/,
        include: [resolveArr(['components', 'lib', 'plugins', 'config', 'store', 'sdk/src'])],
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['sdk-dist']),
    new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en')
  ],
  output: {
    path: path.resolve(__dirname, './sdk-dist'),
    filename: 'sdk.js'
  }
}
