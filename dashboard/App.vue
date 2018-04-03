<template>
    <div class="app">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
   data () {
       return {

       }
   },
   created () {
       console.log(this);
   }
}
</script>

<style lang="less">
    .app {
        display: block;
        width: 100%;
        height: 100%;
    }
</style>
