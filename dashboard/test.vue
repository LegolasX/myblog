<template>
    <div>
        <p class="classname" data-id="sdfsd">32{{title}}sdf{{title2}}</p>
        <ul>
            <li>1</li>
            <li>1</li>
            <li>1</li>
        </ul>
        <div v-if="title === 'sdf'">我正确</div>
        <div v-else>我错误</div>
        <p v-on:click="clickFunc">{{title}}</p>
        <ul>
            <li v-for="item in list" :key="item" v-text="item"></li>
        </ul>
    </div>
</template>
<script>
export default {
    data () {
        return {
            title: '非静态标题',
            title2: 'title2',
            id: true,
            list: [
                'a',
                'b',
                'c',
                'd'
            ]
        }
    },
    methods: {
        clickFunc () {
            console.log(title);
        }
    }
}
</script>

