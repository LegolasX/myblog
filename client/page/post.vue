<template>
    <div class="blog_post">
        <section>
            <header class="post-title">
                <h1>{{post.title}}</h1>
            </header>
            <div class="post-content" v-html="post.content">
            </div>
        </section>
        <section>
            <p class="next_post">阅读下一篇博文</p>
            <article class="float_card post_card">
                <header>
                    <h3>自己动手打造智能物联网设备</h3>
                </header>
                <p>
                    自从前段时间研究了智能家居设备之后，我便迷上了物联网和开源硬件。玩遍了市面上各种常见的物联网产品，总觉得各有不足，于是我突发奇想：干脆自己做一个！
                </p>
            </article>
        </section>
        <section class="comment" ref="commentContainer">
            <form class="float_card add_comment" ref="addCommentForm">
                <header>
                    <img src="../assets/images/none.png" alt="">
                    <div class="comment_user">
                        <input type="text" placeholder="点击输入昵称" name="nickname" v-model="userInfo.nickname">
                        <input type="hidden" name="position" :value="position">
                        <p>在{{position}}说：</p>
                    </div>
                </header>
                <textarea name="comment" class="comment_content" placeholder="点击此处输入评论内容"></textarea>
                <input name="contact" class="comment_contact" type="text" placeholder="选填：个人主页/微博/邮箱/微信" v-model="userInfo.contact">
                <button type="button" class="comment_submit" @click="addComment">保存</button>
                <p class="comment_explain"><strong>隐私说明：</strong>你的留言审核通过后会被公开，但个人主页等信息不会被公开显示；你的 IP 地址会被保存，但只会公开显示你当前所在的城市名。</p>
            </form>
            <ul class="comment_list" ref="commentList">
                <li class="float_card comment_item" v-for="(comment, index) in commentList" :key="comment.commentId" :data-comment-id="comment.commentId" :data-index="index">
                    <header>
                        <img src="../assets/images/none.png" alt="">
                        <div class="comment_user">
                            <p class="username">{{comment.nickname}}</p>
                            <p class="time_position">在{{comment.position}}说：</p>
                        </div>
                    </header>
                    <p class="comment_content">
                        {{comment.comment}}
                    </p>
                    <ul class="action_panel">
                        <li>
                            <button  @click="voteOrDislikeComment(comment, true)" class="icon-heart" :class="{'active': comment.vote}">                            
                                赞同 ({{comment.voteCount}})
                            </button>

                        </li>
                        <li>
                            <button @click="voteOrDislikeComment(comment, false)" class="icon-thumbs-down"  :class="{'active': comment.dislike}">
                                反对 ({{comment.dislikeCount}})
                            </button>
                        </li>
                        <li>
                            <button @click="replyComment(comment, $event)" class="icon-reply">
                                回复
                            </button>
                        </li>
                    </ul>
                    <ul class="replylist">
                        <li v-for="replyItem in comment.replyList" :key="replyItem.commentId">
                            <header>
                                <img src="../assets/images/none.png" alt="">
                                <div class="comment_user">
                                    <p class="username">{{replyItem.nickname}}</p>
                                    <p class="time_position">在{{replyItem.position}}说：</p>
                                </div>
                            </header>
                            <p class="comment_content" v-text="replyItem.comment"></p>
                        </li>
                    </ul>
                </li>
            </ul>
        </section>
    </div>
</template>
<script>
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
            store
        }) {
            return store.dispatch('getPostOnServer');
        },
        data() {
            return {
                userInfo: {
                    nickname: '',
                    contact: ''
                },
                position: '未知地区',
                commentList: [],
                storageManager: null,
                replyFormFragment: null
            }
        },
        computed: {
            post: {
                get() {
                    return this.$store.state.post;
                },
                set(newValue) {
                    this.$store.commit('setPostContent', newValue);
                }
            }
        },
        mounted() {
            this.replyFormFragment =  document.createDocumentFragment();
            if (!this.post.title) {
                getPostById(this.$route.params.postId).then(res => {
                    if (res.status = 200) {
                        this.post = res.data.data;
                        console.log('post page client render');
                    }
                })
            }
            // 获取地址信息
            if (window.remote_ip_info) {
                this.position = window.remote_ip_info.province + window.remote_ip_info.city;
            } else {
                let element = document.createElement('script');
                element.src = '//int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
                document.body.appendChild(element);
                element.onload = () => {
                    this.position = window.remote_ip_info.province + window.remote_ip_info.city;
                    document.body.removeChild(element);
                }
            }
            this.getComments();
            // setTimeout(this.getComments.bind(this), 2000);
        },
        destroyed() {
            // 清空store
            this.post = {};
        },
        methods: {
            showTitle(title) {
                console.log(title);
            },
            getComments () {
                // 获取评论数据及其状态
                Promise.all([getCommentList(this.$route.params.postId),
                    import ('../util/storage.js')
                ]).then(([res, exports]) => {
                    if (res.data.code === 200) {
                        this.commentList = res.data.data;
                        this.storageManager = exports.default;
                        this.storageManager.init();
                        this.commentList.forEach(comment => {
                            comment.voteCount = comment.voteCount || 0;
                            comment.dislikeCount = comment.dislikeCount || 0;
                            let state = this.storageManager.getCommentState(comment.commentId);
                            this.$set(comment, 'vote', (state & 2) === 2);
                            this.$set(comment, 'dislike', (state & 1) === 1);
                            if (!comment.replyList) {
                                this.$set(comment, 'replyList', []);
                            }
                            this.userInfo = this.storageManager.getUserInfo();
                        });
                    } else {
                        this.$toast({
                            message: '评论获取失败，请刷新页面重试'
                        })
                    }
                })
            },
            addComment() {
                let addCommentForm = this.$refs.addCommentForm;
                if (addCommentForm.comment.value === '') {
                    this.$toast({
                        message: '请输入评论内容'
                    });
                    return void 666;
                }
                let commentId = addCommentForm.parentNode.dataset.commentId;
                let comment = {
                    postId: this.$route.params.postId,
                    nickname: this.userInfo.nickname || '匿名用户',
                    comment: addCommentForm.comment.value,
                    position: this.position,
                    contact: this.userInfo.contact,
                    commentTime: Date.now()
                }
                if (commentId !== undefined) {
                    // 回复评论
                    comment.commentId = commentId;
                    let index = this.$refs.addCommentForm.parentNode.dataset.index
                    replyComment(comment).then(res => {
                        if (res.data.code === 200) {
                            this.commentList[index].replyList.unshift(comment);
                            addCommentForm.comment.value = '';
                            this.storageManager && this.storageManager.setUserInfo(this.userInfo);
                        }
                    })
                } else {
                    // 评论文章
                    addComment(comment).then(res => {
                        if (res.data.code === 200) {
                            comment.commentId = res.data.data.commentId;
                            addCommentForm.comment.value = '';
                            this.commentList.unshift(Object.assign({
                                voteCount: 0,
                                dislikeCount: 0,
                                vote: false,
                                dislike: false,
                                replyList: []
                            }, comment));
                            this.storageManager && this.storageManager.setUserInfo(this.userInfo);
                        }
                    })
                }

            },
            voteOrDislikeComment(comment, vote) {
                if (vote) {
                    if (!comment.vote) {
                        voteOrDislikeComment(comment.commentId, vote).then(res => {
                            if (res.data.code === 200) {
                                comment.vote = true;
                                comment.voteCount++;
                                this.storageManager && this.storageManager.addVoteCommentId(comment.commentId);
                            } else {
                                this.$toast({
                                    message: '请求失败，请重试'
                                });
                            }

                        })
                    } else {
                        cancelVoteOrDislike(comment.commentId, vote).then(res => {
                            if (res.data.code === 200) {
                                comment.vote = false;
                                comment.voteCount--;
                                this.storageManager && this.storageManager.removeVoteCommentId(comment.commentId);
                            } else {
                                this.$toast({
                                    message: '请求失败，请重试'
                                });
                            }
                        })
                    }
                } else {
                    if (!comment.dislike) {
                        voteOrDislikeComment(comment.commentId, vote).then(res => {
                            if (res.data.code === 200) {
                                comment.dislike = true;
                                comment.dislikeCount++;
                                this.storageManager && this.storageManager.addDislikeCommentId(comment.commentId);
                            } else {
                                this.$toast({
                                    message: '请求失败，请重试'
                                });
                            }

                        })
                    } else {
                        cancelVoteOrDislike(comment.commentId, vote).then(res => {
                            if (res.data.code === 200) {
                                comment.dislike = false;
                                comment.dislikeCount--;
                                this.storageManager && this.storageManager.removeDislikeCommentId(comment.commentId);
                            } else {
                                this.$toast({
                                    message: '请求失败，请重试'
                                });
                            }
                        })
                    }
                }
            },
            replyComment(comment, event) {
                let commentItem = event.target.parentNode.parentNode.parentNode;
                // 已经插入到当前评论
                if (this.$refs.addCommentForm.parentNode === commentItem) {
                    return void 666;
                }
                let replyList = commentItem.getElementsByClassName('replylist')[0];
                this.replyFormFragment.appendChild(this.$refs.addCommentForm);
                commentItem.insertBefore(this.replyFormFragment, replyList);
            }
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

    .float_card {
        margin: 0 auto;
        border-radius: 10px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05), 0 15px 100px 0 rgba(0, 0, 75, 0.125);
        transition: box-shadow ease-out .5s, opacity linear .3s;
        transition-delay: .2s;
        opacity: 0.75;
        &:hover {
            box-shadow: 0 5px 12px rgba(0, 0, 0, 0.05), 0 15px 180px 0 rgba(0, 0, 50, 0.25);
            opacity: 1;
        }
    }

    .post_card {
        max-width: 500px;
        width: 60%;
        margin-top: 50px;
        padding: 1.5em 2em;
        cursor: pointer;
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

    .comment {
        margin-top: 70px;
    }

    .add_comment {
        margin-top: 40px;
        overflow: hidden;
        padding: 2em 2.5em;
        color: @fontColorDescription;
        header {
            overflow: hidden;
        }
        header img {
            width: 75px;
            height: 75px;
            float: left;
            margin-right: 20px;
            border-radius: 50%;
        }
        .comment_user {
            overflow: hidden;
            padding-top: 15px;
            input {
                border: 0;
                font-size: 18px;
                min-width: 200px;
                background-color: transparent;
            }
            p {
                margin-top: 5px;
                font-size: 14px;
            }
        }
        .comment_content {
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #eee;
            border-radius: 4px;
            margin-top: 20px;
            padding: 10px;
            font-size: 16px;
            height: 100px;
            resize: vertical;
        }
        .comment_contact {
            min-width: 300px;
            margin-top: 15px;
            margin-bottom: 20px;
            border: 1px solid #eee;
            padding: 5px 10px;
            font-size: 16px;
            height: 30px;
            border-radius: 6px;
            float: left;
        }
        .comment_submit {
            width: 100px;
            margin-top: 15px;
            padding: 5px 10px;
            border: 1px solid #eee;
            background-color: white;
            border-radius: 6px;
            font-size: 16px;
            line-height: 30px;
            float: right;
            cursor: pointer;
            &:hover {
                background-color: #eee;
            }
        }
        .comment_explain {
            clear: both;
            margin-top: 20px;
            strong {
                color: @fontColorTitle;
            }
        }
    }

    .comment_list {
        margin-top: 40px;
        padding: 0;
        background-color: transparent;
        .comment_item {
            margin-top: 40px;
            padding: 2em 2.5em;
            background-color: white;
            header {
                overflow: hidden;
            }
            header img {
                width: 75px;
                height: 75px;
                float: left;
                margin-right: 20px;
                border-radius: 50%;
            }
            .comment_user {
                overflow: hidden;
                padding-top: 15px;
                .username {
                    font-size: 18px;
                }
                .time_position {
                    margin-top: 5px;
                    font-size: 14px;
                }
            }
            .comment_content {
                font-size: 18px;
                margin-top: 20px;
            }
            .action_panel {
                font-size: 0;
                margin-top: 15px;
                text-align: center;
                li {
                    display: inline-block;
                    font-size: 14px;
                    color: @fontColorDescription;
                    width: 30%;
                    button {
                        vertical-align: middle;
                        padding: 15px 25px;
                        border-radius: 4px;
                        &:hover {
                            background-color: rgba(0, 0, 0, .1);
                        }
                    }
                }
            }
            .replylist {
                margin-left: 40px;
                li {
                    margin-top: 30px;
                    header img {
                        width: 50px;
                        height: 50px;
                    }
                    .comment_user {
                        padding-top: 7px;
                        .username {
                            font-size: 14px;
                        }
                        .time_position {
                            font-size: 12px;
                        }
                    }
                    .comment_content {
                        font-size: 16px;
                    }
                }
            }
        }
    }

    .icon-heart.active::before,
    .icon-thumbs-down.active::before {
        color: #e41524;
    }
</style>
