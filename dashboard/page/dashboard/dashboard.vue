<template>
    <div>
        <mu-linear-progress v-if="inProgress" />
        <dash-header :tab-index="tabIndex" @changeTab="changeTab" />
        <section class="content_wrapper">
            <router-view></router-view>
        </section>
    </div>
</template>
<script>
    import dashHeader from '../../components/header/header.vue';
    import muLinearProgress from 'muse-ui/src/linearProgress/index';
    import muList from 'muse-ui/src/list/list';
    import muListItem from 'muse-ui/src/list/listItem';

    export default {
        data() {
            return {
                inProgress: false,
                tabIndex: 0
            }
        },
        methods: {
            changeTab (tabIndex) {
                this.tabIndex = tabIndex;
            }
        },
        components: {
            dashHeader,
            muLinearProgress
        }
    }
</script>
<style lang="less" scoped>
    .mu-linear-progress {
        z-index: 5;
    }
    .content_wrapper {
        margin: 40px 30px 0 380px;
        color:#68646d;
    }
</style>
