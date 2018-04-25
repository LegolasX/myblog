<template>
    <div class="bbs_wrapper">
        <h1>留言板</h1>
        <p class="bbs_number">已经有{{this.commentList.length}}人在此处留言</p>
        <comment :data-list="commentList" @comment="commentSubmit"/>
    </div>
</template>
<script>
    import comment from '../component/comment/comment.vue';
    import {
        addComment,
        replyComment,
        getBBSCommentList
    } from '../api/api'

    export default {
        asyncData({
            store,
            router
        }) {
            return store.dispatch('getBBSCommentOnServer', router.currentRoute.params.username);
        },
        data () {
            return {
            }
        },
        computed: {
            commentList: {
                get () {
                    return this.$store.state.BBSCommentList;
                },
                set (newValue) {
                    this.$store.commit('setBBSCommentList', newValue);
                }
            }
        },
        created () {
            /* getBBSCommentList(this.$route.params.username).then(res => {
                if (res.data.code === 200) {
                    this.commentList = res.data.data;
                } else {
                    this.$toast({
                        message: '留言获取失败，请刷新页面重试'
                    });
                }
            }) */
        },
        methods: {
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
                    comment.username = this.$route.params.username;
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
        },
        components: {
            comment
        }
    }
</script>
<style lang="less" scoped>
    @import url('../assets/css/const.less');
    .bbs_wrapper {
        h1 {
            font-size: 32px;
            letter-spacing: 1px;
            font-weight: 600;
            color: @fontColorTitle;
            text-align: center;
        }
        .bbs_number {
            font-size: 24px;
            letter-spacing: 1px;
            font-weight: 600;
            color: @fontColorTitle;
            text-align: center;
            margin: 30px 0;
        }

    }
</style>
