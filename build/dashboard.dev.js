const path = require('path');
const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const dashboardConfig = require('../build/webpack.dev.dashboard.js');
const app = express();


// dashboard bundle hot-reload
const dashboardComplier = webpack(dashboardConfig);

app.use(devMiddleware(dashboardComplier, {
    publicPath: dashboardConfig.output.publicPath,
    quiet: true
}));

app.use(hotMiddleware(dashboardComplier, {
    // 保持一致
    path: '/__dashboard_hmr',
    heartbeat: 2000
}));


app.listen(3031, () => console.log('dashboard dev server is running at port 3031'));