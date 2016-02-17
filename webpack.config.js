module.exports = {  
  entry: './src/app.ts',
  output: {
    filename: './prebuild/app.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.html']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.html$/, loader: "text-loader" }
    ]
  }
}