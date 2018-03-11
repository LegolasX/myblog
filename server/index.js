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
if (isProd) {
    // 生产环境
    let serverBundle = require('./vue-ssr-server-bundle.json');
    const renderOption = {
        runInNewContext: false,
        template: fs.readFileSync(templatePath, 'utf-8')
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
    console.log(chalk.yellow('[ request url ]: ' + req.url));
    // bundleRender(req, res);
    readyPromise.then(() => {
        bundleRender(req, res);
    })

});

function bundleRender (req, res) {
    // const clientManifest = require('../static/dist/vue-ssr-client-manifest.json');
    const clientBundleFileUlr = '/static/dist/bundle.client.js';

    const context = {
        url: req.url,
        title: 'vue 服务端渲染实践',
        clientBundleUrl: clientBundleFileUlr
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

app.listen(3030, function () {
    console.log('server is starting at port 3030');
});




function normalRender (req, res) {
    const serverBundle = require('../static/dist/bundle.server.js');
    const createVueInstance = serverBundle.default;
    const renderer = vueServerRender.createRenderer({
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