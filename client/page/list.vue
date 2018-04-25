<template>
    <section class="blog_home">
        <h1 class="category_title" v-if="$route.name === 'category'">
            分类：{{category ? category.categoryName : ''}}
        </h1>
        <article class="blog_post" v-for="post in postList" :key="post.postId">
            <div class="post_image" :style="post.coverUrl | coverStyleSlim" @click="gotoPost(post.postId)"></div>
            <div class="post_title" @click="gotoPost(post.postId)">
                <h2>{{post.title}}</h2>
                <p>{{post.description}}</p>
                <div class="post_info">{{post.createTime}} 发布 | {{post.commentCount}}条评论</div>
            </div>
        </article>
        <div class="emptyList" v-if="postList && postList.length === 0">
            <p>阿偶，暂时没有文章</p>
        </div>
    </section>
</template>
<script>
    import {
        getPostList
    } from '../api/api.js';

    export default {
        asyncData({ store, router }) {
            if (router.currentRoute.name === 'blog') {
                return store.dispatch('getListOnServer', {
                    username: router.currentRoute.params.username,
                    categoryId: undefined
                });
            } else if (router.currentRoute.name === 'category') {
                let categoryId = router.currentRoute.params.categoryId;
                return store.dispatch('getListOnServer', {
                    categoryId,
                    username: undefined
                });
            }
        },
        data() {
            return {}
        },
        mounted() {
            // ssr降级
            if (!(this.postList instanceof Array)) {
                if (this.$route.name === 'category') {
                    getPostList(undefined, this.$route.params.categoryId).then(res => {
                        if (res.data.code === 200) {
                            this.$store.commit('setList', res.data.data);
                            console.log('category page client render');
                        }
                    })
                } else if (this.$route.name === 'blog') {
                    let username = this.$route.params.username;
                    getPostList(username).then((res) => {
                        if (res.status === 200) {
                            this.$store.commit('setList', res.data.data);
                            console.log('list page client render');
                        }
                    })
                }
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
            },
            category: {
                get () {
                    return this.$store.state.category;
                }
            }
        }
    }
</script>
<style lang="less">
    @import url('../assets/css/const.less');
    @import url('../assets/css/mixin');
    .blog_home {
        padding: 0 30px;

        .category_title {
            font-size: 32px;
            letter-spacing: 1px;
            font-weight: 600;
            color: @fontColorTitle;
            text-align: center;
            margin-bottom: 20px;
        }
        .blog_post {
            padding-top: 24px;
            padding-bottom: 48px;
            .post_image {
                width: 230px;
                height: 160px;
                float: right;
                margin-left: 20px;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: cover;
                cursor: pointer;
            }
            .post_title {
                display: table-cell;
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
                @media screen and (min-width: 1550px) {
                    p {
                        font-size: 18px;
                    }
                }
            }
            .post_info {
                color: @fontColorInfo;
                font-size: 14px;
                padding-top: 10px;
            }
        }
        .emptyList {
            color: @fontColorTitle;
            font-size: 22px;
            text-align: center;
        }
    }

    @media screen and (max-width: 480px) {
        .blog_home {
            padding: 0;

            .blog_post {
                padding-top: 0;
                padding-bottom: 20px;

                .post_image {
                    width: 100%;
                    height: 200px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 25, 0.1), 0 5px 75px 1px rgba(0, 0, 50, 0.2);
                }

                .post_title {
                    padding: 15px 5px;

                    h2 {
                        font-size: 18px;
                    }
                    p {
                        font-size: 12px;
                        margin: 10px 0;
                    }
                }

                .post_info {
                    padding: 0;
                    font-size: 12px;
                }
            }
        }
        
    }
</style>
