const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const config = require('./config');

const museUiThemePath = path.join(
    __dirname,
    '..',
    'node_modules',
    'muse-ui',
    'src/styles/themes/variables/light.less'
)

baseConfig.module.rules[2].use[3] = {
    loader: 'less-loader',
    options: {
        globalVars: {
            'museUiTheme': `'${museUiThemePath}'`,
            'bdcolor': '#333333'
        }
    }
}

module.exports = Object.assign({}, baseConfig, {
    entry: {
        dashboard: [path.resolve(__dirname, '../dashboard/app.js'), 'webpack-hot-middleware/client?path=/__dashboard_hmr&reload=true'],
        vendor: ['vue', 'vue-router', 'axios']
    },
    output: {
        // js文件编译输出目录
        path:  path.resolve(__dirname, '../dashboard'),
        // 文件中Url的网络路径
        publicPath: '/dashboard',
        filename: '[name].[hash:8].dashboard.js'
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
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../server/dashboard.template.html'),
            filename: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
});