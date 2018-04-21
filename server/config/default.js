const auth = require('./auth');

module.exports = {
    port: 3030,
    session: {
        key: 'ECIZEP_SESSIONID',
        secret: 'lovelyy',
        maxAge: 3600000,
        domain: process.env.NODE_ENV === 'production' ? 'sunriseteam.cn' : 'ecizep.com'
    },
    mongodb: {
        url: `mongodb://${auth.user}:${auth.password}@127.0.0.1:27017/blog`,
        port: 27017,
        dbName: 'blog'
    },
    qiniu: {
        accessKey: '506YwbVY2LsUaiLGJ9eRq3BF18bQxoDFQv3aRTlh',
        secretKey: 'oF3BjptI3Zv0E6ftXY7XeuVi-qTv915ZGZBJNZnv',
        bucket: 'website'
    }
}