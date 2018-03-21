const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const vueSSRClientPlugin = require('./vur-server-renderer-client-plugin');
const config = require('./config.js');
const isProd = process.env.NODE_ENV === 'production';

clientConfig = Object.assign({}, baseConfig, {
    entry: {
        app: [path.resolve(__dirname, '../client/client-entry.js')],
        vendor: ['vue', 'vue-router', 'vuex', 'axios']
    },
    output: {
        path: config.client.path,
        publicPath: isProd ? config.client.production.publicPath : config.client.dev.publicPath,
        filename: '[name].[hash:8].client.js',
        // 非入口chunk的文件名称
        chunkFilename: '[name].[hash:8].client.js'
    },
    plugins: [
        new CleanWebpackPlugin(path.resolve(__dirname, '../static/client/'), {
            root: path.resolve(__dirname, '../../myblog/'),
            verbose: true,
            dry: false
        }),
        new webpack.BannerPlugin(new Date().getFullYear() + '年' + parseInt(new Date().getMonth() + 1, 10) + '月' + new Date().getDate() + '日' + new Date().getHours() + '点' + new Date().getMinutes() + '分' + '编译'),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minchunks: 2
        }),
        new vueSSRClientPlugin()
    ]
});

if (isProd) {
    // 生产环境压缩
    clientConfig.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
        exclude: [/server/, /static/],
        comments: false,
        compress: {
            warnings: false
        }
    }));
}

module.exports = clientConfig;