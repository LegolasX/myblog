import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './App.vue';
import { createRouter } from './routes/index';
import { createStore } from './store/store';

Vue.use(VueRouter);
Vue.use(Vuex);

/* Vue.mixin({
    beforeMount: function () {
        const { asyncData } = this.$options;
        if (asyncData) {
            this.dataPormise = asyncData({
                store: this.$store
            })
        }
    }
}) */

export function createApp () {
    const router = createRouter();
    const store = createStore();
    const app = new Vue({
        router,
        store,
        render: h => h(App)
    });
    return { app, router, store };
}