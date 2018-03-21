import http from '../util/http';
import Qs from 'qs';

// 登录注册相关的api的baseUrl需要去掉/dashboard
const instance = http.create({
    baseURL: http.defaults.baseURL.replace(/\/dashboard/, '')
});

export const login = (username, password) => {
    return instance.post('login', Qs.stringify({
        username,
        password
    }))
}