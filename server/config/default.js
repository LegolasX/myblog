const auth = require('./auth');

module.exports = {
    port:  process.env.NODE_ENV === 'production' ? 3030 : 80,
    session: {
        key: 'ECIZEP_SESSIONID',
        secret: 'lovelyy',
        maxAge: 3600000,
        domain: process.env.NODE_ENV === 'production' ? '140.143.164.218' : 'local.oeino.cn'
    },
    qiniu: auth.qiniu,
    mongodb: auth.mongodb
}