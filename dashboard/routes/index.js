export default [{
    name: 'dashboard',
    path: '/',
    component: () => import('../page/dashboard/dashboard.vue'),
    children: [
        {
            name: 'createArticle',
            path: 'createArticle',
            component: () => import('../page/article/create-article.vue')
        }
    ]
},{
    name: 'login',
    path: '/login',
    component: () => import('../page/login/login.vue')
},{
    path: '*',
    redirect: '/'
}]