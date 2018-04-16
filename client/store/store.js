import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import config from '../../build/config';

/* import {
    getPostList,
    getPostById
} from '../api/api.js' */

const isProd = process.env.NODE_ENV === 'production';
let baseUrl = 'http:';
if (isProd) {
    baseUrl += config.client.production.apiBaseUrl;
} else {
    baseUrl += config.client.dev.apiBaseUrl;
}

export function createStore() {
    return new Vuex.Store({
        state: {
            postList: null,
            category: null,
            post: {},
            nextPost: {},
            BBSCommentList: []
        },
        mutations: {
            setList (state, list) {
                state.postList = list;
            },
            setCategory (state, category) {
                state.category = category;
            },
            setPostContent (state, data) {
                state.post = data.post || state.post;
                state.nextPost = data.nextPost || state.nextPost;
            },
            setBBSCommentList (state, BBSCommentList) {
                state.BBSCommentList = BBSCommentList;
            }
        },
        actions: {
            getListOnServer ({commit}, payload) {
                return axios.get(`${baseUrl}postList`, {
                    params: {
                        username: payload.username,
                        categoryId: payload.categoryId
                    }
                }).then(res => {
                    if (res.data.code === 200) {
                        console.log('server request postList success ' + payload.username + payload.categoryId);
                        let postList = !!payload.categoryId ? res.data.data.postList : res.data.data;
                        if (!!payload.categoryId) {
                            postList = res.data.data.postList;
                            commit('setCategory', res.data.data.category)
                        } else {
                            postList = res.data.data
                        }
                        commit('setList', postList);
                    } else {
                        console.log('server reques postList fail: ' + payload.username + payload.categoryId);
                    }
                })
            },
            getPostOnServer ({commit}, postId) {
                return axios.get(baseUrl + 'post/' + postId).then(res => {
                    if (res.data.code === 200) {
                        console.log('server requeset post success');
                        commit('setPostContent', res.data.data);
                    } else {
                        console.log('server requeset post fail ' + postId);
                    }
                })
            },
            getBBSCommentOnServer ({commit}, username) {
                return axios.get(baseUrl + 'comment', {
                    params: {
                        username
                    }
                }).then(res => {
                    if (res.data.code === 200) {
                        console.log('server request bbs commentlist');
                        commit('setBBSCommentList', res.data.data);
                    } else {
                        console.log('server request bbs commentlist fail: ' + username);
                    }
                })
            }
        }
    })
}