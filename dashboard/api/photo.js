import {
    http
} from '../util/http';
import {
    serializeParams
} from '../util/util.js'

export const getUploadToken = () => http.get('/upload/token');