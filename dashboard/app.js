import Vue from 'vue';
import vueRouter from 'vue-router';
import routes from './routes/index';
import App from './App.vue';

Vue.use(vueRouter);

const router = new vueRouter({
    routes
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})