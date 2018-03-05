import axios from 'axios';
import {
    API_BASE_URL
} from './constants.js';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 10000;
// 跨域请求携带cookie
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

export default axios;
