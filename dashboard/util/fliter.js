import {
    CDN_BASE_URL,
    IMAGE_PROCESS_AVATAR,
    IMAGE_PROCESS_BGURL,
    IMAGE_PROCESS_POSTCOVER
} from './constants'

export function avatarUrl (url) {
    if (!url) return '';
    if (url.slice(0, 5) === 'blob:') {
        return url;
    }
    return CDN_BASE_URL + url + IMAGE_PROCESS_AVATAR;
}

export function slimUrl (url) {
    if (!url) return '';
    return CDN_BASE_URL + url + '?imageslim';
}

export function bgStyleSlim (bgUrl) {
    if (bgUrl && bgUrl.slice(0, 5) === 'blob:') {
        return {
            backgroundImage: 'Url(' + bgUrl + ')'
        };
    }
    return {
        backgroundImage: bgUrl ? 'Url(' + CDN_BASE_URL + bgUrl + IMAGE_PROCESS_BGURL + ')' : ''
    }
}

export function coverStyleSlim (bgUrl, isPost) {
    if (bgUrl && bgUrl.slice(0, 5) === 'blob:') {
        return {
            backgroundImage: 'Url(' + bgUrl + ')'
        };
    }
    return {
        backgroundImage: bgUrl ? 'Url(' + CDN_BASE_URL + bgUrl + IMAGE_PROCESS_POSTCOVER + ')' : ''
    }
}