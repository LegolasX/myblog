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
            name: 'userlist',
            path: '/user/:username',
            component: list
        },{
            name: 'post',
            path: '/post/:postId',
            component: () => import(
                /* webpackChunkName: "post" */
                '../page/post.vue'
            )
        },
        {
            path: '*',
            redirect: '/'
        }]
    })
}