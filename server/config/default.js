module.exports = {
    port: 3030,
    session: {
        key: 'ECIZEP_SESSIONID',
        secret: 'lovelyy',
        maxAge: 1800000
    },
    mongodb: {
        url: 'mongodb://127.0.0.1:27017',
        port: 27017,
        dbName: 'blog'
    }
}