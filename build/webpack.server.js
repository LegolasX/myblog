const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const vueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = Object.assign({}, baseConfig, {
    target: 'node',
    entry: {
        app: ['./client/server-entry.js']
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, '../server'),
        publicPath: '//localhost:3030/static/dist/',
        filename: 'bundle.server.js'
    },
    plugins: [
        new webpack.BannerPlugin(new Date().getFullYear() + '年' + parseInt(new Date().getMonth() + 1, 10) + '月' + new Date().getDate() + '日' + new Date().getHours() + '点' + new Date().getMinutes() + '分' + '编译'),
        new vueSSRServerPlugin()
    ]
})