const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const resolve = dir => path.resolve(__dirname, dir)
const resolveArr = dirs => dirs.map(dir => resolve(dir))

module.exports = {
  entry: './sdk/src/index.js',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: resolve('components'),
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: [resolveArr(['components', 'lib', 'plugins', 'config', 'sdk/src'])]
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
    new CleanWebpackPlugin(['sdk-dist'])
  ],
  output: {
    path: path.resolve(__dirname, './sdk-dist'),
    filename: 'sdk.js'
  },
}
