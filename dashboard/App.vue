<template>
    <div class="app">
        <router-view v-if="$route.name === 'login'"></router-view>
        <div v-else>
            <mu-linear-progress v-if="inProgress" />
            <dash-header/>
            <section class="content_wrapper">
                <transition :name="transitionName">
                    <router-view></router-view>
                </transition>
            </section>
        </div>
    </div>
</template>
<script>
    import dashHeader from './components/header/header.vue';
    import muLinearProgress from 'muse-ui/src/linearProgress/index';
    
    export default {
        data() {
            return {
                inProgress: false,
                transitionName: 'fade'
            }
        },
        watch: {
            $route: function (to, from) {
                if (to.name === 'setting' || from.name === 'setting') {
                    this.transitionName = 'bottomup';
                } else {
                    this.transitionName = 'fade'
                }
            }
        },
        methods: {

        },
        components: {
            dashHeader,
            muLinearProgress
        }
    }
</script>

<style lang="less">
    .app {
        display: block;
        width: 100%;
        height: 100%;

        .mu-linear-progress {
            z-index: 5;
        }
        .content_wrapper {
            padding: 40px 30px 0 380px;
            color:#68646d;
        }
    }



    .bottomup-enter, .bottomup-leave-to {
        transform: translate(0, 100%)
    }
    .bottomup-enter-active, .bottomup-leave-active {
        transition: transform 0.3s ease-in;
    }
</style>
