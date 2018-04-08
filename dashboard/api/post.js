import http from '../util/http';
import {
    serializeParams
} from '../util/util.js';

export const createPost = (article) => http.post('/post', serializeParams(article));