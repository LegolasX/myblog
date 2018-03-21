

export default [{
    name: 'dashboard',
    path: '/',
    component: () => import(
        /* webpackChunkName: "dashboard" */
        '../page/dashboard/dashboard.vue'
    ),
    children: [{
            name: 'createArticle',
            path: 'createArticle',
            component: () => import(
                /* webpackChunkName: "createArticle" */
                '../page/article/create-article.vue'
            )
        }, {
            name: 'categoryArticle',
            path: 'categoryArticle',
            component: () => import(
                /* webpackChunkName: "categoryArticle" */
                '../page/article/category.vue'
            )
        }
    ]
},{
    name: 'login',
    path: '/login',
    component: () => import(
        /* webpackChunkName: "login" */
        '../page/login/login.vue'
    )
},{
    path: '*',
    redirect: '/'
}]