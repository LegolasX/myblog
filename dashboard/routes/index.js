export default [{
    name: 'dashboard',
    path: '/',
    component: () => import(
        /* webpackChunkName: "dashboard" */
        '../page/dashboard/dashboard.vue'
    )
},{
    name: 'login',
    path: '/login',
    component: () => import(
        /* webpackChunkName: "login" */
        '../page/login/login.vue'
    )
},{
    name: 'createArticle',
    path: '/createArticle',
    component: () => import(
        /* webpackChunkName: "createArticle" */
        '../page/article/create-article.vue'
    )
}, {
    name: 'categoryArticle',
    path: '/categoryArticle',
    component: () => import(
        /* webpackChunkName: "categoryArticle" */
        '../page/article/category.vue'
    )
}, {
    name: 'articleList',
    path: '/articleList',
    component: () => import(
        /* webpackChunkName: "articleList" */
        '../page/article/article-list.vue'
    )
}, {
    name: 'photos',
    path: '/photos',
    component: () => import(
        /* webpackChunkName: "photos" */
        '../page/photos/photos.vue'
    )
}, {
    name: 'setting',
    path: '/setting',
    component: () => import(
        /* webpackChunkName: "photos" */
        '../page/setting/setting.vue'
    )
}, {
    path: '*',
    redirect: '/'
}]