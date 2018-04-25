import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import config from '../../build/config';

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
            BBSCommentList: [],
            user: {}
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
            },
            setUser (state, user) {
                state.user = user;
            }
        },
        actions: {
            getListOnServer ({commit}, payload) {
                let listPormise = axios.get(`${baseUrl}postList`, {
                    params: {
                        username: payload.username,
                        categoryId: payload.categoryId
                    }
                });
                
                if (payload.categoryId) {
                    return listPormise.then(listRes => {
                        if (listRes.data.code === 200) {
                            console.log('server request postList success ' + payload.username + payload.categoryId);
                            let postList = !!payload.categoryId ? listRes.data.data.postList : listRes.data.data;
                            if (!!payload.categoryId) {
                                postList = listRes.data.data.postList;
                                commit('setCategory', listRes.data.data.category)
                            } else {
                                postList = listRes.data.data
                            }
                            commit('setList', postList);
                            return axios.get(`${baseUrl}profile/${listRes.data.data.category.username}`)
                        } else {
                            console.log('server reques postList fail: ' + payload.username + payload.categoryId);
                        }
                    }).then(userRes => {
                        if (userRes.data.code === 200) {
                            commit('setUser', userRes.data.data || {})
                        }
                    })
                } else {
                    let userPromise = axios.get(`${baseUrl}profile/${payload.username}`);
                    return Promise.all([listPormise, userPromise]).then(([listRes, userRes]) => {
                        if (listRes.data.code === 200) {
                            console.log('server request postList success ' + payload.username + payload.categoryId);
                            let postList = !!payload.categoryId ? listRes.data.data.postList : listRes.data.data;
                            if (!!payload.categoryId) {
                                postList = listRes.data.data.postList;
                                commit('setCategory', listRes.data.data.category)
                            } else {
                                postList = listRes.data.data
                            }
                            commit('setList', postList);
                        } else {
                            console.log('server reques postList fail: ' + payload.username + payload.categoryId);
                        }
                        if (userRes.data.code === 200) {
                            commit('setUser', userRes.data.data || {})
                        }
                    })
                }
            },
            getPostOnServer ({commit}, postId) {
                return axios.get(baseUrl + 'post/' + postId).then(res => {
                    if (res.data.code === 200) {
                        console.log('server requeset post success');
                        commit('setPostContent', res.data.data);
                        return axios.get(`${baseUrl}profile/${res.data.data.post.username}`)
                    } else {
                        console.log('server requeset post fail ' + postId);
                    }
                }).then(res => {
                    if (res.data.code === 200) {
                        commit('setUser', res.data.data);
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
                        return axios.get(`${baseUrl}profile/${username}`)
                    } else {
                        console.log('server request bbs commentlist fail: ' + username);
                    }
                }).then(res => {
                    if (res.data.code === 200) {
                        commit('setUser', res.data.data);
                    }
                })
            }
        }
    })
}