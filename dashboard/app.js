import Vue from 'vue';
import vueRouter from 'vue-router';
import routes from './routes/index';
import App from './App.vue';
import './assets/css/icon.css';
import 'muse-ui/src/styles/base.less';
import './assets/css/reset.less';
import Toast from './components/toast/index';

Vue.prototype.$toast = Toast;
Vue.use(vueRouter);

const router = new vueRouter({
    routes
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})