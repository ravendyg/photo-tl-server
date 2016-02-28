const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {  
    entry: './src/app.ts',
    output: {
        filename: './prebuild/app.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.html']
    },
    watch: NODE_ENV === 'development',
    devtool: NODE_ENV === 'development' ? "source-map" : null,
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
            { test: /\.html$/, loader: "text-loader" }
        ]
    }
}