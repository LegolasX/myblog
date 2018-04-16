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