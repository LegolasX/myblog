import confirmOption from './confirm';
import Vue from 'vue';

const ConfirmConstructor = Vue.extend(confirmOption);

const singleInstance = new ConfirmConstructor({
    el: document.createElement('div')
});

/* 
    {Object} options => {
        {String} title: 确认框文案
        {String} content: 确认框内容
        {Function} cancel: 取消回调函数
        {Function} confirm: 确认回调函数
    }
*/
let confirm = (options) => {
    if (singleInstance.show) {
        console.warn('[Confirm Component]: Do not support multi-instance');
        return void 666;
    }
    singleInstance.show = true;
    singleInstance.title = options.title || singleInstance.title;
    singleInstance.content = options.content || singleInstance.content;
    singleInstance.cancel = typeof options.cancel === 'function' ? options.cancel : function () {};
    singleInstance.confirm = typeof options.confirm === 'function' ? options.confirm : function () {};
    return singleInstance;
}

export default confirm;