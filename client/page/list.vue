<template>
    <section class="blog_home">
        <article class="blog_post" v-for="post in postList" :key="post.postId">
            <img class="post_image" :src="post.imageUrl" @click="gotoPost(post.postId)">
            <div class="post_title" @click="gotoPost(post.postId)">
                <h2>{{post.title}}</h2>
                <p>{{post.summary}}</p>
            </div>
            <div class="post_info">
                {{post.createTime}} 发布 | {{post.commentCount}}条评论
            </div>
        </article>
    </section>
</template>
<script>
    import {
        getPostList
    } from '../api/api.js';

    export default {
        asyncData({ store, router }) {
            console.log(router.currentRoute);
            let username = 'ecizep';
            if (router.currentRoute.name === 'userlist') {
                username = router.currentRoute.params.username;
            }
            return store.dispatch('getListOnServer', username);
        },
        data() {
            return {}
        },
        created() {

        },
        mounted() {
            if (this.postList.length === 0) {
                let username = 'ecizep';
                if (this.$route.name === 'userlist') {
                    username = this.$route.params.username;
                }
                getPostList(username).then((res) => {
                    if (res.status === 200) {
                        this.$store.commit('setList', res.data.data);
                        console.log('list page client render');
                    }
                })
            }
        },
        methods: {
            gotoPost: function (postId) {
                this.$router.push({
                    name: 'post',
                    params: {
                        postId: postId
                    }
                });
            }
        },
        computed: {
            postList: {
                get() {
                    return this.$store.state.postList;
                },
                set(newValue) {
                    this.$store.commit('setList', newValue);
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    @import url('../assets/css/const.less');
    @import url('../assets/css/mixin');
    .blog_home {
        padding: 0 30px;
        .blog_post {
            padding-top: 24px;
            padding-bottom: 48px;
            .post_image {
                width: 230px;
                height: 160px;
                float: right;
                margin-left: 20px;
                cursor: pointer;
            }
            .post_title {
                overflow: hidden;
                cursor: pointer;
                h2 {
                    font-size: 26px;
                    font-weight: 400;
                }
                p {
                    height: 4.5em;
                    overflow: hidden;
                    color: @fontColorDescription;
                    font-size: 16px;
                    line-height: 1.5em;
                    margin: 10px 0;
                    .ellipsisLn(3);
                }
            }
            .post_info {
                color: @fontColorInfo;
                font-size: 14px;
                padding-top: 10px;
            }
        }
    }
</style>
