import VueRouter from 'vue-router';

const list =  () => import(
    /* webpackChunkName: "list" */
    '../page/list.vue'
);

export function createRouter () {
    return new VueRouter({
        mode: 'history',
        routes: [{
            name: 'list',
            path: '/',
            component: list
        }, {
            name: 'blog',
            path: '/blog/:username',
            component: list
        }, {
            name: 'category',
            path: '/category/:categoryId',
            component: list
        }, {
            name: 'post',
            path: '/post/:postId',
            component: () => import(
                /* webpackChunkName: "post" */
                '../page/post.vue'
            )
        }, {
            name: 'bbs',
            path: '/bbs/:username',
            component: () => import(
                /* webpackChunkName: "bbs" */
                '../page/bbs.vue'
            )
        }, {
            path: '*',
            redirect: '/'
        }]
    })
}