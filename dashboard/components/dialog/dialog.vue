<template>
    <transition name="bottomup">
        <div v-show="show" class="dialog_wrapper">
            
        </div>
    </transition>
</template>
<script>
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {

            }
        }
    }
</script>
<style lang="less" scoped>
    .dialog_wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: yellow;
        z-index: 3;
    }
    .bottomup-enter, .bottomup-leave-to {
        transform: translate(0, 100%)
    }
    .bottomup-enter-active, .bottomup-leave-active {
        transition: transform 0.3s ease-in;
    }
</style>
