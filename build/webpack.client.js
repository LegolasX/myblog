const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const vueSSRClientPlugin = require('./vur-server-renderer-client-plugin');
const config = require('./config.js');
const isProd =  process.env.NODE_ENV === 'production';

clientConfig = Object.assign({}, baseConfig, {
    entry: {
        app: [path.resolve(__dirname, '../client/client-entry.js')],
        vendor: ['vue', 'vue-router', 'vuex', 'axios']
    },
    output: {
        path: path.resolve(__dirname, '../static/dist'),
        publicPath: isProd ? config.production.publicPath : config.dev.publicPath,
        filename: '[name].[hash:8].client.js'
    },
    plugins: [
        new webpack.BannerPlugin(new Date().getFullYear() + '年' + parseInt(new Date().getMonth() + 1, 10) + '月' + new Date().getDate() + '日' + new Date().getHours() + '点' + new Date().getMinutes() + '分' + '编译'),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify('true'),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minchunks: 2
        }),
        new vueSSRClientPlugin({
            clientManifestPath: path.resolve(__dirname, '../server/')
        })
    ]
});

if (isProd) {
    // 生产环境压缩
    clientConfig.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
        exclude: [/server/, /static/],
        comments: false
    }));
}

module.exports = clientConfig;