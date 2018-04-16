import {
    http,
    frontEndHttp
} from '../util/http';
import {
    serializeParams
} from '../util/util.js';

export const createPost = (article) => http.post('/post', serializeParams(article));

export const updatePost = (postId, article) => http.put(`/post/${postId}`, serializeParams(article));

export const getPostList = () => http.get('/postList');

// 根据postId请求文章
export const getPostById = postId => frontEndHttp.get(`/post/${postId}`);

export const deletePost = (postId) => http.delete(`/post/${postId}`);