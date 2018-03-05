import VueRouter from 'vue-router';

export function createRouter () {
    return new VueRouter({
        mode: 'history',
        routes: [{
            name: 'list',
            path: '/',
            component: () => import('../page/list.vue')
        }, {
            name: 'userlist',
            path: '/user/:username',
            component: () => import('../page/list.vue')
        },{
            name: 'post',
            path: '/post/:postId',
            component: () => import('../page/post.vue')
        },
        {
            path: '*',
            redirect: '/'
        }]
    })
}