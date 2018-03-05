import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

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
                return axios.get('http://localhost:3030/api/postList/' + username).then(res => {
                    console.log('server request postList ' + username);
                    commit('setList', res.data.data);
                })
            },
            getPostOnServer ({commit}) {
                return axios.get('http://localhost:3030/api/post/4').then(res => {
                    console.log('server requeset post');
                    commit('setPostContent', res.data.data);
                })
            }
        }
    })
}