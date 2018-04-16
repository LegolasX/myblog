<template>
    <div class="app">
        <router-view v-if="$route.name === 'login'"></router-view>
        <div v-else>
            <mu-linear-progress v-if="inProgress" />
            <dash-header/>
            <section class="content_wrapper">
                <router-view></router-view>
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
                inProgress: false
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
</style>
