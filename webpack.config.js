const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { webpack } = require('webpack');

module.exports = {
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
        },
    },
    devServer: {
        port: 8900,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
        }),
    ],
};