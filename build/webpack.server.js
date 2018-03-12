const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const vueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const isProd = process.env.NODE_ENV === 'production';
const config = require('./config');

serverBundleConfig = Object.assign({}, baseConfig, {
    target: 'node',
    entry: {
        app: ['./client/server-entry.js']
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, '../server'),
        publicPath: isProd ? config.production.publicPath : config.dev.publicPath,
        filename: '[name].[hash:8].server.js'
    },
    plugins: [
        new webpack.BannerPlugin(new Date().getFullYear() + '年' + parseInt(new Date().getMonth() + 1, 10) + '月' + new Date().getDate() + '日' + new Date().getHours() + '点' + new Date().getMinutes() + '分' + '编译'),
        new webpack.DefinePlugin({
            PRODUCTION: isProd ? JSON.stringify('true') : JSON.stringify('false'),
        }),
        new vueSSRServerPlugin()
    ]
})

module.exports = serverBundleConfig