import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import config from '../../build/config';

/* import {
    getPostList,
    getPostById
} from '../api/api.js' */

export function createStore() {
    return new Vuex.Store({
        state: {
            postList: [],
            post: {}
        },
        mutations: {
            setList (state, list) {
                state.postList = list;
            },
            setPostContent (state, post) {
                state.post = post;
            }
        },
        actions: {
            getListOnServer ({commit}, username) {
                const isProd = process.env.NODE_ENV === 'production';
                let url = 'http:';
                if (isProd) {
                    url += config.client.production.apiBaseUrl + 'postLost/' + username;
                } else {
                    url += config.client.dev.apiBaseUrl + 'postLost/' + username;
                }
                return axios.get(url).then(res => {
                    console.log('server request postList ' + username);
                    commit('setList', res.data.data);
                })
            },
            getPostOnServer ({commit}, postId) {
                return axios.get('http://localhost:3030/api/post/' + postId).then(res => {
                    console.log('server requeset post');
                    commit('setPostContent', res.data.data);
                })
            }
        }
    })
}