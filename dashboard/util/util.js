export const serializeParams = (obj) => {
    if (typeof obj !== 'object') {
        throw Error('serializeParams error: must be object');
    }
    let result = '';
    let first = true;
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && !!obj[key]) {
            if (!first) {
                result += '&';
            }
            if (typeof obj[key] === 'object') {
                console.log('serializeParams Warning');
            }
            result += key + '=' + encodeURIComponent(obj[key].toString());
            first = false;
        }
    }
    return result;
}

export function formatDate (time) {
    let date = new Date(parseInt(time));
    let result = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes()
    }
    for (var key in result) {
        if (result.hasOwnProperty(key) && result[key] < 10) {
            result[key] = '0' + result[key].toString();
        }
    }
    result.date = result.year + '-' + result.month + '-' + result.day;
    result.time = result.hour + ':' + result.minute;
    result.value = time;
    return result;
}