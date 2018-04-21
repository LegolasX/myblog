const path = require('path');
const devDomain = '//ecizep.com'
const productionDomain = '//140.143.164.218:3030'

module.exports = {
    client: {
        // client webpack文件本地输出目录
        path: path.resolve(__dirname, '../static/client/'),
        dev: {
            publicPath: devDomain +'/static/client/',
            apiBaseUrl: devDomain + '/api/'
        },
        production: {
            publicPath: productionDomain + '/static/client/',
            apiBaseUrl: productionDomain + '/api/'
        }
    },
    dashboard: {
        // dashboard webpack文件本地输出目录
        path: path.resolve(__dirname, '../static/dashboard/'),
        dev: {
            publicPath: devDomain + '/static/dashboard/',
            apiBaseUrl: devDomain + '/api/dashboard/'
        },
        production: {
            publicPath: productionDomain + '/static/dashboard/',
            apiBaseUrl: productionDomain + '/api/dashboard/'
        }
    }
}