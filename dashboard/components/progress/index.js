import Vue from 'vue';
import linearProgress from 'muse-ui/src/linearProgress/linearProgress';

const progressConstructor = Vue.extend(linearProgress);

let el = document.createElement('div');
const singleInstance = new progressConstructor({
    el,
    mounted () {
        this.$el.style.display = 'none'
    }
})
document.body.insertBefore(singleInstance.$el, document.getElementById('app'));

let progress = {
    show (options = {}) {
        if (options.value) {
            singleInstance.mode = 'determinate'
        } else {
            singleInstance.mode = 'indeterminate'
        }
        singleInstance.value = options.value;
        singleInstance.size = options.size;
        singleInstance.color = options.color || '#ea8783';
        singleInstance.$el.style.display = 'block';
    },
    hide () {
        singleInstance.$el.style.display = 'none';
    }
}

export default progress;