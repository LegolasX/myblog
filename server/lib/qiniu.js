const qiniu = require('qiniu');
const config = require('../config/index');

let mac = new qiniu.auth.digest.Mac(config.qiniu.accessKey, config.qiniu.secretKey);

let options = {
    scope: config.qiniu.bucket
};
let putPolicy = new qiniu.rs.PutPolicy(options);

exports.getUploadToken = function getUploadToken () {
    return putPolicy.uploadToken(mac);
}
