const path = require('path')

module.exports = {
  entry: './example/client/client.js',
  output: {
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /executions\//,
        use: {
          loader: 'remote-execution-loader',
          options: {
            key: path.resolve(__dirname, './keys/private')
          }
        }
      }
    ]
  }
}
