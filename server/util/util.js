
exports.isArray =  function (array) {
    return Object.prototype.toString.call(array) === '[object Array]';
}

exports.formateDate = function (createTime) {
    let now = new Date(parseInt(createTime));
    let result = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes()
    }
    for (var key in result) {
        if (result.hasOwnProperty(key) && result[key] < 10) {
            result[key] = '0' + result[key].toString();
        }
    }
    result.date = result.year + '-' + result.month + '-' + result.day + ' ' + result.hour + ':' + result.minute;
    return result;
}