const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const vueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const isProd = process.env.NODE_ENV === 'production';
const config = require('./config');

serverBundleConfig = Object.assign({}, baseConfig, {
    target: 'node',
    entry: {
        app: ['./client/server-entry.js'],
        vendor: ['vue', 'vue-router', 'vuex', 'axios']
    },
    output: {
        libraryTarget: 'commonjs2',
        path: config.client.path,
        publicPath: isProd ? config.client.production.publicPath : config.client.dev.publicPath,
        filename: '[name].[hash:8].server.js'
    },
    plugins: [
        new webpack.BannerPlugin(new Date().getFullYear() + '年' + parseInt(new Date().getMonth() + 1, 10) + '月' + new Date().getDate() + '日' + new Date().getHours() + '点' + new Date().getMinutes() + '分' + '编译'),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new vueSSRServerPlugin()
    ]
})

module.exports = serverBundleConfig