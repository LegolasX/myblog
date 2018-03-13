import { createApp } from './app.js'

export default context => {
    // 有可能是异步路由钩子函数或组件，所以返回一个Promise
    return new Promise((resolve, reject) => {
        const {app, router, store} = createApp();
        router.push(context.url);
        // 路由加载完毕后再开始解析路由对应的组件
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents();
            console.log('matchedComponents length:' + matchedComponents.length);
            matchedComponents.forEach(component => {
                console.log(component);
                console.log(component.__file);
            });
            if (!matchedComponents.length) {
                reject({
                    code: 404
                });
            } else {
                // 预取数据
                Promise.all(matchedComponents.map(component => {
                    if (component.asyncData) {
                        // 把已经生成的vue实例的store传进去，数据取回先放到store里面
                        return component.asyncData({store, router})
                    }
                })).then(() => {
                    // 数据取回来了,把数据传给context,这样服务端渲染模板的时候可以把数据打进去
                    context.state = store.state;
                    resolve(app);
                }, (info) => {
                    console.log('asyncData rejected:', info);
                }).catch(reject.bind(this, {
                    code: 100001,
                    message: 'server-entry error'
                }));
            }
        })

    })

}