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
    }
}