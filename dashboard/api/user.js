import {
    http,
    frontEndHttp
} from '../util/http';
import {
    serializeParams
} from '../util/util'

export const login = (username, password) => {
    return frontEndHttp.post('login',serializeParams({
        username,
        password
    }))
}

export const getUserProfile = () => {
    return http.get('/profile');
}

export const updateUserProfile = (username, profile) => {
    return http.put('/profile/' + username, serializeParams(profile));
}