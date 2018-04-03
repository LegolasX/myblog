import axios from 'axios';
import {
    API_BASE_URL
} from './constants.js';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 10000;
// 跨域请求携带cookie
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

axios.interceptors.response.use(function (response) {
    if (response.status === 200 && response.data.code === 203) {
        let returnUrl = location.href;
        location.href = location.origin + '/dashboard#/login?returnUrl=' + encodeURIComponent(returnUrl)
    } else {
        return response;
    }
})

export default axios;
