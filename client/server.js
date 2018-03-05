const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const clientConfig = require('../build/webpack.dev.config');
const compiler = webpack(clientConfig);
const express = require('express');
const app = express();
const path = require('path');

// 设置视图目录
app.set('views', path.join(__dirname, '../'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(devMiddleware(compiler, {
    publicPath: clientConfig.output.publicPath,
    quiet: true
}));

app.use(hotMiddleware(compiler, {
    log: false,
    heartbeat: 2000
}));

app.get('/', function (req, res) {
    res.render('index');
})
 
app.listen(8081, () => console.log('Example app listening on port 3000!'))