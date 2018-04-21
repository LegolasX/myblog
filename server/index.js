const path = require('path');
const express = require('express');
const fs = require('fs');
const vueServerRender = require('vue-server-renderer');
const chalk = require('chalk');
const app = express();

// 开发模式
const isProd = process.env.NODE_ENV === 'production';
let bundleRenderer;
let readyPromise;
let templatePath = path.resolve(__dirname, './index.template.html')
if (isProd || process.env.SERVER_ALONE === 'alone') {
    // 生产环境 或者脱离开发模式
    let serverBundle = require('../static/client/vue-ssr-server-bundle.json');
    let clientManifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../static/client/vue-ssr-client-manifest.json')));
    const renderOption = {
        runInNewContext: false,
        template: fs.readFileSync(templatePath, 'utf-8'),
        clientManifest,
        // 预加载资源控制
        shouldPreload: (file, type) => {
            if (type === 'script') {
                return true;
            } else {
                return false;
            }
        },
        // 预取资源控制
        shouldPrefetch: (file, type) => {
            return false
        }
    }
    bundleRenderer = vueServerRender.createBundleRenderer(serverBundle, renderOption);
    readyPromise = Promise.resolve();
} else {
    // 开发环境
    readyPromise = require('../build/devServer.js')(app, templatePath, (serverBundle, renderOption) => {
        if (serverBundle) {
            bundleRenderer = vueServerRender.createBundleRenderer(serverBundle, renderOption);
            console.log(chalk.green('[ webpack.server.js ]: bundleRenderer update'));
        }
    })
}

// 业务中间件
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const CORS = require('./middleware/cors');
const config = require('./config/default');

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
resolve = relativePath => path.resolve(__dirname, relativePath);
// 设置静态资源目录
app.use('/static', express.static(resolve('../static/')));
app.use('/favicon.ico', express.static(resolve('../favicon.ico')));
app.use('/manifest.json',express.static(resolve('../manifest.json')));

// 解析表单 application/json 类型数据
app.use(bodyParser.json());
// 解析表单 application/x-www-form-urlencoded 类型数据
app.use(bodyParser.urlencoded({
    extended: false
}));

// cookie parser 中间件
app.use(cookieParser());

// session 中间件
app.use(session({
    // cookie中保存session id的字段名称
    name: config.session.key,
    // hash secret的值放在cookie中，防止cookie篡改
    secret: config.session.secret,
    // 强制更新 session
    resave: true, 
    // 设置为 false，强制创建一个 session，即使用户未登录
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge
    }
}));

// 设置路由
const apiRouter = require('./router/api');

app.use('/api', apiRouter);
app.use('/dashboard',  function (req, res, next) {
    console.log(req.baseUrl);
    if (req.baseUrl === '/dashboard') {
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(path.resolve(__dirname, '../static/dashboard/dashboard.html'));
    } else {
        res.end('404');
    }
    
});

let ECIZEP_ID = 1;
app.all('*', function (req, res, next) {
    // 给未登录的用户挂一个id
    if (!req.cookies.ECIZEP_ID) {
        res.setHeader('Set-Cookie', `ECIZEP_ID=${ECIZEP_ID++}`);
    }
    next();
});

app.get('*', (req, res, next) => {
    console.log(chalk.yellow('[ request url ]: ' + req.url));
    // bundleRender(req, res);
    readyPromise.then(() => {
        bundleRender(req, res);
    })

});

function bundleRender (req, res) {
    const context = {
        url: req.url,
        title: ''
    };

    bundleRenderer.renderToString(context, (err, html) => {
        if (err) {
            console.log(err);
            res.status(500).end('Internal Server Error');
            return ;
        } else {
            res.status(200).end(html)
        }
    });
}

app.listen(config.port, function () {
    console.log('server is starting at port ' + config.port);
});



let ios = express();

ios.get('/api/iosInfo', function (req, res) {
    res.json({
        code: 200,
        data: {
            shouldShow: true,
            url: "http://140.143.164.218:3030/post/5ad40fd6825ccf3095579b44"
        },
        message: "success"
    });
})

ios.listen(80, function () {
    console.log('ios running at port 80');
})