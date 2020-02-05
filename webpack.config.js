const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const src = path.join(__dirname, 'src')
const dist = path.join(__dirname, 'build')

const stats = {
  assets: true,
  chunks: false,
  children: false,
  version: false,
  modules: false,
  builtAt: false,
  colors: true,
  hash: false,
  timings: false,
  entrypoints: false
}

/**
 *
 * Client
 *
 */
const clientConfig = {
  target: 'web',
  stats,
  entry: path.join(src, 'client/index.js'),
  output: {
    path: path.join(dist, 'client'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.styl$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'stylus-loader'
      }]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(src, 'client/index.html'),
      filename: 'index.html'
    })
  ]
}

/**
 *
 * Server
 *
 */
const serverConfig = {
  target: 'node',
  stats,
  entry: './src/index.js',
  output: {
    library: 'q-api-validation',
    libraryTarget: 'umd',
    path: dist,
    filename: 'q-api-validation.js'
  }
}

module.exports = [clientConfig, serverConfig]
