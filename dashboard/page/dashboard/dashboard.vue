<template>
    <div>
        <div @click="show = !show">dashboard main page</div> 
        <mudialog :show="show">
        </mudialog>
    </div>
</template>
<script>
    import mudialog from '../../components/dialog/dialog.vue'
    export default {
        data() {
            return {
                show: false
            }
        },
        methods: {
            changeTab (tabIndex) {
                this.tabIndex = tabIndex;
            }
        },
        components: {
            mudialog
        }
    }
</script>
<style lang="less" scoped>

</style>
