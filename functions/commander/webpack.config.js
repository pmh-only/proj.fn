// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  mode: 'production',
  entry: [
    path.join(__dirname, 'src', '/main.ts')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    library: {
      type: 'commonjs2'
    }
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
}
