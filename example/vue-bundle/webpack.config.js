const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: './index.js'
    },

    output: {
        path: path.resolve((__dirname, 'dist')),
        filename: '[name].js'
    },

    resolveLoader: {
        alias: {
            LazyLoader: path.resolve((__dirname, './loader/dynamic-bundle-loader'))
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }, {
                test:/\.vue$/,
                loader:'vue-loader'
            }, {
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'react bundle',
            template: path.resolve((__dirname, 'public/index.html')),
            filename: path.resolve((__dirname, 'dist/index.html')),
            chunks: ['index']
        })
    ],

    devtool: 'source-map'
}
