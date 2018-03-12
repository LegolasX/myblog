const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const path = require('path');
const vueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const config = require('./config');

module.exports = Object.assign({}, baseConfig, {
    entry: {
        app: [path.resolve(__dirname, '../client/client-entry.js')],
        vendor: ['vue', 'vue-router', 'vuex', 'axios',  'webpack-hot-middleware/client?noInfo=true&reload=true']
    },
    output: {
        // js文件编译输出目录
        path:  path.resolve(__dirname, '../static/dist'),
        // 文件中Url的网络路径
        publicPath: config.dev.publicPath,
        filename: '[name].client.js'
    },
    plugins: [
        new webpack.BannerPlugin('dev middleware' + new Date().getFullYear() + '年' + parseInt(new Date().getMonth() + 1, 10) + '月' + new Date().getDate() + '日' + new Date().getHours() + '点' + new Date().getMinutes() + '分' + '编译'),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minchunks: 2
        }),
        new webpack.HotModuleReplacementPlugin(),
        new vueSSRClientPlugin()
    ]
});