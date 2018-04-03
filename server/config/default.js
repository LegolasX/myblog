module.exports = {
    port: 3030,
    session: {
        key: 'ECIZEP_SESSIONID',
        secret: 'lovelyy',
        maxAge: 3600000,
        domain: process.env.NODE_ENV === 'production' ? '140.143.164.218' : 'ecizep.com'
    },
    mongodb: {
        url: 'mongodb://127.0.0.1:27017',
        port: 27017,
        dbName: 'blog'
    },
    qiniu: {
        accessKey: '506YwbVY2LsUaiLGJ9eRq3BF18bQxoDFQv3aRTlh',
        secretKey: 'oF3BjptI3Zv0E6ftXY7XeuVi-qTv915ZGZBJNZnv',
        bucket: 'website'
    }
}