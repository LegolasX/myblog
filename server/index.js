const path = require('path');
const express = require('express');
const app = express();

// 开发配置
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const clientConfig = require('../build/webpack.dev.config');
const compiler = webpack(clientConfig);

app.use(devMiddleware(compiler, {
    publicPath: clientConfig.output.publicPath,
    quiet: true
}));

app.use(hotMiddleware(compiler, {
    log: false,
    heartbeat: 2000
}));

// 业务中间件
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const CORS = require('./middleware/cors');
const checklogin = require('./util/checklogin');
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
        maxAge: config.session.maxAge,
        domain: 'ecizep.com'
    }
}));

// 设置路由
const dashboardRouter = require('./router/dashboard');
const signinRouter = require('./router/signin');
const apiRouter = require('./router/api');

app.use('/dashboard', checklogin, dashboardRouter);
app.use('/login', signinRouter);
app.use('/api', apiRouter);

let ECIZEP_ID = 1;
app.all('*', function (req, res, next) {
    // 给未登录的用户挂一个id
    if (!req.cookies.ECIZEP_ID) {
        res.setHeader('Set-Cookie', `ECIZEP_ID=${ECIZEP_ID++}`);
    }
    next();
});

app.get('*', (req, res) => {
    console.log(req.url);
    //normalRender(req, res);
    bundleRender(req, res);
});

function normalRender (req, res) {
    
    const serverBundle = require('../static/dist/bundle.server.js');
    const createVueInstance = serverBundle.default;
    const renderer = require('vue-server-renderer').createRenderer({
        template: require('fs').readFileSync(path.resolve(__dirname, './index.template.html'), 'utf-8')
    })
    const context = {
        url: req.url
    };
    const templateData = {
        title: 'vue 服务端渲染实践',
        clientBundleUrl: '/static/dist/bundle.client.js'
    }

    createVueInstance(context).then(vueInstance => {
        if (vueInstance.code === 404) {
            console.log('cannot find router');
        } else {
            // 此时store里面预请求的数据已经被存入context.state了,打入模板数据里
            templateData.state = context.state;
            renderer.renderToString(vueInstance, templateData, (err, html) => {
                if (err) {
                    console.log(err);
                    res.status(500).end('Internal Server Error');
                    return ;
                } else {
                    res.status(200).end(html)
                }
            })
        }
    }, (onReject) => {
        console.log(onReject);
    }); 
}

function bundleRender (req, res) {
    const clientManifest = require('../static/dist/vue-ssr-client-manifest.json');
    const serverBundle = require('../static/dist/vue-ssr-server-bundle.json');
    const renderOption = {
        runInNewContext: false,
        template: require('fs').readFileSync(path.resolve(__dirname, './index.template.html'), 'utf-8')
    };

    const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, renderOption);
    const clientBundleFileUlr = '/static/dist/bundle.client.js';

    const context = {
        url: req.url,
        title: 'vue 服务端渲染实践',
        clientBundleUrl: renderOption.clientManifest ? '' : clientBundleFileUlr
    };

    renderer.renderToString(context, (err, html) => {
        if (err) {
            console.log(err);
            res.status(500).end('Internal Server Error');
            return ;
        } else {
            res.status(200).end(html)
        }
    });
}

app.listen(3030, function () {
    console.log('server is starting at port 3030');
});