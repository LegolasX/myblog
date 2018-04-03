import Vue from 'vue';
import muToast from './toast.vue';

const muToastConstructor = Vue.extend(muToast);

const singleInstance = new muToastConstructor({
    el: document.createElement('div')
});

let toast = (options = {}) => {
    singleInstance.visible = true;
    options.duration = options.duration || 2000;
    singleInstance.message = typeof options.message === 'string' ? options.message : '';
    clearTimeout(singleInstance.timer);
    document.body.appendChild(singleInstance.$el);
    Vue.nextTick(function () {
        singleInstance.timer = setTimeout(function () {
            singleInstance.visible = false;
        }, options.duration);
    });
    return singleInstance;
}

export default toast;