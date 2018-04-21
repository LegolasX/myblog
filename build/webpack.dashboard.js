const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const config = require('./config.js');
const isProd = process.env.NODE_ENV === 'production';

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

dashboardConfig = Object.assign({}, baseConfig, {
    entry: {
        app: [path.resolve(__dirname, '../dashboard/app.js')],
        vendor: ['vue', 'vue-router', 'axios']
    },
    output: {
        path: config.dashboard.path,
        publicPath: isProd ? config.dashboard.production.publicPath : config.dashboard.dev.publicPath,
        filename: '[name].[hash:8].client.js',
        // 非入口chunk的文件名称
        chunkFilename: '[name].[hash:8].client.js'
    },
    plugins: [
        new CleanWebpackPlugin(path.resolve(__dirname, '../static/dashboard/'), {
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
            minChunks: 2
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../server/dashboard.template.html'),
            filename: 'dashboard.html'
        })
    ]
});

// muse-ui babel转义
dashboardConfig.module.rules.unshift({
    test: /muse-ui.src.*?js$/,
    use: ['babel-loader']
});

if (isProd) {
    // 生产环境压缩
    dashboardConfig.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
        exclude: [/\/server/, /\/static/, /((min|pack)\.js)$/],
        comments: false,
        compress: {
            warnings: false
        }
    }));
}

module.exports = dashboardConfig;