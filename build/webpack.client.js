const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const vueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = Object.assign(baseConfig, {
    entry: {
        app: [path.resolve(__dirname, '../client/client-entry.js')]
    },
    output: {
        path: path.resolve(__dirname, '../static/dist'),
        publicPath: '//localhost:3030/static/dist/',
        filename: 'bundle.client.js'
    },
    plugins: [
        new webpack.BannerPlugin(new Date().getFullYear() + '年' + parseInt(new Date().getMonth() + 1, 10) + '月' + new Date().getDate() + '日' + new Date().getHours() + '点' + new Date().getMinutes() + '分' + '编译'),
        new vueSSRClientPlugin()
    ]
});