import Vue from 'vue';
import vueRouter from 'vue-router';
import routes from './routes/index';
import App from './App.vue';
import './assets/css/icon.css';
import 'muse-ui/src/styles/base.less';
import './assets/css/reset.less';

// 注册全局方法
import toast from './components/toast/index';
import confirm from './components/confirm/index';
import progress from './components/progress/index';

Vue.prototype.$toast = toast;
Vue.prototype.$confirm = confirm;
Vue.prototype.$progress = progress;

// 全局过滤器
import * as fliterObject from './util/fliter.js';

for (let key in fliterObject) {
    Vue.filter(key, fliterObject[key]);   
}


Vue.use(vueRouter);

const router = new vueRouter({
    routes
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})