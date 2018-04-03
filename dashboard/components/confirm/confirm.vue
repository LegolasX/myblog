<template>
    <div>
        <mu-dialog :open="show" :title="title">
            {{content}}
            <mu-flat-button slot="actions" @click="cancelAction" primary label="取消"/>
            <mu-flat-button slot="actions" @click="confirmAction" primary label="确定"/>
        </mu-dialog>
    </div>
</template>
<script>
    import muDialog from 'muse-ui/src/dialog/index';
    import muFlatButton from 'muse-ui/src/flatButton/index';
    export default {
        data () {
            return {
                show: false,
                title: '提示',
                content: '你确定要执行本次操作吗？'
            }
        },
        methods: {
            cancelAction () {
                this.show = false;
                this.cancel && this.cancel();
            },
            confirmAction () {
                this.show = false;
                this.confirm && this.confirm();
            }
        },
        components: {
            muDialog,
            muFlatButton
        }
    }
</script>


