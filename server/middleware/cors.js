module.exports = function (req, res, next) {
    console.log(req.url);
    const OriginList = ['http://localhost:8081', 'https://localhost:8081', 'http://ecizep.com:8081', 'http://ecizep.com:3030'];
    if (OriginList.some(value => value === req.headers.origin)) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        // 非简单请求
        res.setHeader('Access-Control-Allow-Headers', req.headers['Access-Control-Request-Headers'] ? req.headers['Access-Control-Request-Headers'] : 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    if (req.method === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
    
}