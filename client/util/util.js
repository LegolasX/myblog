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
            result += key + '=' + obj[key].toString();
            first = false;
        }
    }
    return result;
}