const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = Object.assign({}, baseConfig, {
    entry: {
        app: [path.resolve(__dirname, '../client/client-entry.js'), 'webpack-hot-middleware/client?noInfo=true&reload=true']
    },
    output: {
        // js文件编译输出目录
        path:  path.resolve(__dirname, '../static/dist'),
        // 文件中Url的网络路径
        publicPath: '/static/dist/',
        filename: 'bundle.client.js'
    },
    plugins: [
        new webpack.BannerPlugin('dev middleware' + new Date().getFullYear() + '年' + parseInt(new Date().getMonth() + 1, 10) + '月' + new Date().getDate() + '日' + new Date().getHours() + '点' + new Date().getMinutes() + '分' + '编译'),
        new webpack.HotModuleReplacementPlugin()
    ]
});