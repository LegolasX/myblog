import http from '../util/http';
import Qs from 'qs';

export const login = (username, password) => {
    return http.post('/login', Qs.stringify({
        username,
        password
    }))
}