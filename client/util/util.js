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

export function isWX() {
    return /micromessenger/i.test(navigator.userAgent);
}

export function isAndroid() {
    let UA = navigator.userAgent;
    let isAndroid = UA.indexOf('Android') > -1 || UA.indexOf('Adr') > -1;
    return isAndroid;
}

export function isiOS() {
    let UA = navigator.userAgent;
    let isiOS = !!UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    return isiOS;
}