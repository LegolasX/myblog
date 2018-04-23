<template>
    <div id="app" @click="addRippleEffect">
        <blog-header></blog-header>
        <main class="blog-content">
            <router-view></router-view>
        </main>
    </div>
</template>
<script>
    import blogHeader from './component/header/header.vue';

    export default {
        data() {
            return {

            }
        },
        created() {

        },
        methods: {
            addRippleEffect(event) {
                let target = event.target;
                if (target.tagName.toLowerCase() !== 'button') return false;
                let rect = target.getBoundingClientRect();
                let ripple = target.querySelector('.ripple');
                if (!ripple) {
                    ripple = document.createElement('span');
                    ripple.className = 'ripple';
                    ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
                    target.appendChild(ripple);
                }
                ripple.className = 'ripple';
                // console.log(event.pageY, rect.top, ripple.offsetHeight, this.$refs.blogContent.scrollTop);
                let top = event.pageY - rect.top - ripple.offsetHeight / 2;
                let left = event.pageX - rect.left - ripple.offsetWidth / 2;
                ripple.style.top = top + 'px';
                ripple.style.left = left + 'px';
                ripple.className += ' active';
                // console.log(ripple);
                return false;
            }
        },
        components: {
            blogHeader
        }
    }
</script>
<style lang="less">
    @import url('./assets/css/reset.less');
    #app {
        height: 100%;
    }

    .blog-content {
        box-sizing: border-box;
        margin-left: 33.3%;
        padding: 40px 25px;
        height: 100%;
        overflow-y: auto;
    }

    @media screen and (max-width: 960px) {
        #app {
            height: initial;
        }
        .blog-content {
            margin-left: 0;
            padding: 40px 15px;
        }
    }

    @media screen and (max-width: 480px) {
        .blog-content {
            padding: 20px 10px;
        }
    }

    button {
        display: inline-block;
        padding: 5px 10px;
        border: none;
        outline: none;
        user-select: none;
        position: relative;
        cursor: pointer;
        overflow: hidden;
        background-color: transparent;
    }

    .ripple {
        position: absolute;
        background: rgba(0, 0, 0, .25);
        border-radius: 100%;
        pointer-events: none;
        opacity: 1;
        transform: scale(0);

        &.active {
            animation: ripple 0.75s ease-out;
        }
    }

    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }


    .float_card {
        margin: 0 auto;
        border-radius: 10px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05), 0 15px 100px 0 rgba(0, 0, 75, 0.125);
        transition: box-shadow ease-out .5s, opacity linear .3s;
        transition-delay: .2s;
        opacity: 0.75;
        &:hover {
            box-shadow: 0 5px 12px rgba(0, 0, 0, 0.05), 0 15px 180px 0 rgba(0, 0, 50, 0.25);
            opacity: 1;
        }
    }
</style>
