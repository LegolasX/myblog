<template>
    <div class="blog_post">
        <section>
            <header class="post-title">
                <h1>{{post.title}}</h1>
            </header>
            <div class="post-content" v-html="post.content">
            </div>
        </section>
        <section v-if="nextPost.title" style="text-align: center">
            <p class="next_post">阅读下一篇博文</p>
            <article class="float_card post_card" @click="gotoNextPost">
                <header>
                    <h3>{{nextPost.title}}</h3>
                </header>
                <p>{{nextPost.description}}</p>
            </article>
        </section>
        <comment :data-list="commentList" @comment="commentSubmit"/>
    </div>
</template>
<script>
    import comment from '../component/comment/comment'
    import {
        getPostById,
        getposition,
        addComment,
        getCommentList,
        voteOrDislikeComment,
        cancelVoteOrDislike,
        replyComment
    } from '../api/api';

    export default {
        asyncData({
            store,
            router
        }) {
            return store.dispatch('getPostOnServer', router.currentRoute.params.postId);
        },
        data() {
            return {
                commentList: [],
            }
        },
        computed: {
            post: {
                get() {
                    return this.$store.state.post;
                },
                set(newValue) {
                    this.$store.commit('setPostContent', {
                        post: newValue
                    });
                }
            },
            nextPost: {
                get () {
                    return this.$store.state.nextPost;
                },
                set (newValue) {
                    this.$store.commit('setPostContent', {
                        nextPost: newValue
                    });
                }
            }
        },
        created () {
            if (typeof window === 'object') {
                // 浏览器环境
                if (!this.post.title) {
                    this.getPostById(this.$route.params.postId);
                }
                this.getComments(this.$route.params.postId);
            }
        },
        destroyed() {
            // 清空store
            this.post = {};
            this.nextPost = {};
        },
        methods: {
            gotoNextPost () {
                this.$router.push({
                    name: 'post',
                    params: {
                        postId: this.nextPost.postId
                    }
                });
            },
            getComments (postId) {
                // 获取评论数据及其状态
                getCommentList(postId).then(res => {
                    if (res.data.code === 200) {
                        this.commentList = res.data.data;
                    } else {
                        this.$toast({
                            message: '评论获取失败，请刷新页面重试'
                        })
                    }
                })
            },
            getPostById (postId) {
                getPostById(postId).then(res => {
                    if (res.status = 200) {
                        this.post = res.data.data.post;
                        this.nextPost = res.data.data.nextPost || {};
                        console.log('post page client render');
                    }
                })
            },
            commentSubmit (comment, commentId, commentList) {
                if (commentId) {
                    // 回复评论
                    comment.commentId = commentId;
                    replyComment(comment).then(res => {
                        if (res.data.code === 200) {
                            commentList.forEach(value => {
                                if (value.commentId === commentId) {
                                    value.replyList.unshift(comment);
                                }
                            })
                            this.$toast({
                                message: '回复成功'
                            });
                        }
                    })
                } else {
                    // 评论文章
                    comment.postId = this.$route.params.postId;
                    addComment(comment).then(res => {
                        if (res.data.code === 200) {
                            comment.commentId = res.data.data.commentId;
                            commentList.unshift(Object.assign({
                                voteCount: 0,
                                dislikeCount: 0,
                                vote: false,
                                dislike: false,
                                replyList: []
                            }, comment));
                            this.$toast({
                                message: '留言成功'
                            });
                        }
                    })
                }
            }
            // 480、600、840、960、1280、1440和1600dp
        },
        beforeRouteUpdate (to, from, next) {
            // 本路由参数变化时被调用
            this.getPostById(to.params.postId);
            this.getComments(to.params.postId);
            next();
        },
        components: {
            comment
        }
    }
</script>
<style lang="less">
    @import url('../assets/css/theme.less');
    .next_post {
        color: @fontColorInfo;
        text-align: center;
        margin-top: 80px;
        font-size: 16px;
    }

    .post_card {
        display: inline-block;
        max-width: 500px;
        width: 60%;
        margin-top: 50px;
        padding: 1.5em 2em;
        cursor: pointer;
        background-color: white;
        text-align: left;
        header {
            font-size: 20px;
        }
        p {
            font-size: 13px;
            line-height: 1.5em;
            color: @fontColorDescription;
            margin-top: 15px;
        }
    }


</style>
