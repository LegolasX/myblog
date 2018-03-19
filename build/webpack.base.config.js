const path = require('path');

const museUiThemePath = path.join(
    __dirname,
    '..',
    'node_modules',
    'muse-ui',
    'src/styles/themes/variables/light.less'
)

module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        less: [
                            'vue-style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 2
                                }
                            },
                            'postcss-loader',
                            {
                                loader: 'less-loader',
                                options: {
                                    globalVars: {
                                        'museUiTheme': `'${museUiThemePath}'`,
                                        'bdcolor': '#333333'
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/, '/server/'],
                use: ['babel-loader']
            },
            {
                test: /\.(less|css)$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240
                        }
                    }
                ]
            },
            {
                test:  /\.(ttf|eot|svg|woff)(\?\S*)*$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".vue", ".css", ".less", ".json"]
    }
}