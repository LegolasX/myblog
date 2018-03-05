
exports.isArray =  function (array) {
    return Object.prototype.toString.call(array) === '[object Array]';
}