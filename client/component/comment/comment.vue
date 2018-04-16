<template>
    <section class="comment" ref="commentContainer">
        <form class="float_card add_comment" ref="addCommentForm">
            <header>
                <img src="../../assets/images/none.png" alt="">
                <div class="comment_user">
                    <input type="text" placeholder="点击输入昵称" name="nickname" v-model="userInfo.nickname">
                    <input type="hidden" name="position" :value="position">
                    <p>在{{position}}说：</p>
                </div>
                <span v-show="showClose" class="icon-close" @click="replyPost"></span>
            </header>
            <textarea name="comment" v-model="comment" class="comment_content" placeholder="点击此处输入评论内容"></textarea>
            <input name="contact" class="comment_contact" type="text" placeholder="选填:主页/邮箱/微信" v-model="userInfo.contact">
            <button type="button" class="comment_submit" @click="addComment">保存</button>
            <p class="comment_explain"><strong>隐私说明：</strong>你的留言审核通过后会被公开，但个人主页等信息不会被公开显示；你的 IP 地址会被保存，但只会公开显示你当前所在的城市名。</p>
        </form>
        <ul class="comment_list" ref="commentList">
            <li class="float_card comment_item" v-for="(comment, index) in commentList" :key="comment.commentId" :data-comment-id="comment.commentId" :data-index="index">
                <header>
                    <img src="../../assets/images/none.png" alt="">
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
                        <button @click="voteOrDislikeComment(comment, true)" class="icon-heart" :class="{'active': comment.vote}">                            
                            赞同 ({{comment.voteCount}})
                        </button>
                    </li>
                    <li>
                        <button @click="voteOrDislikeComment(comment, false)" class="icon-thumbs-down" :class="{'active': comment.dislike}">
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
                            <img src="../../assets/images/none.png" alt="">
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
</template>
<script>
    import storageManager from '../../util/storage';
    import {
        voteOrDislikeComment,
        cancelVoteOrDislike
    } from '../../api/api'
    export default {
        props: {
            dataList: {
                default: [],
                type: Array
            }
        },
        data() {
            return {
                userInfo: {
                    nickname: '',
                    contact: ''
                },
                position: '未知地区',
                commentList: this.dataList,
                comment: '',
                replyFormFragment: null,
                showClose: false
            }
        },
        watch: {
            dataList (value) {
                this.commentList = value;
            },
            commentList (value) {
                this.commentList.forEach(comment => {
                    let state = storageManager.getCommentState(comment.commentId);
                    this.$set(comment, 'vote', (state & 2) === 2);
                    this.$set(comment, 'dislike', (state & 1) === 1);
                    if (!comment.replyList) {
                        this.$set(comment, 'replyList', []);
                    }
                });
            } 
        },
        mounted () {
            // 客户端混入后状态更新
            storageManager.init();
            this.userInfo = storageManager.getUserInfo();
            this.commentList.forEach(comment => {
                let state = storageManager.getCommentState(comment.commentId);
                this.$set(comment, 'vote', (state & 2) === 2);
                this.$set(comment, 'dislike', (state & 1) === 1);
                if (!comment.replyList) {
                    this.$set(comment, 'replyList', []);
                }
            });
            this.replyFormFragment =  document.createDocumentFragment();
            if (window.remote_ip_info) {
                this.position = window.remote_ip_info.province === window.remote_ip_info.city 
                ? window.remote_ip_info.province : window.remote_ip_info.province + window.remote_ip_info.city;
            } else {
                let element = document.createElement('script');
                element.src = '//int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
                document.body.appendChild(element);
                element.onload = () => {
                    this.position = window.remote_ip_info.province === window.remote_ip_info.city 
                        ? window.remote_ip_info.province : window.remote_ip_info.province + window.remote_ip_info.city;
                    document.body.removeChild(element);
                }
            }
        },
        methods: {
            addComment () {
                let addCommentForm = this.$refs.addCommentForm;
                if (addCommentForm.comment.value === '') {
                    this.$toast({
                        message: '请输入评论内容'
                    });
                    return void 666;
                }
                let commentId = addCommentForm.parentNode.dataset.commentId;
                let comment = {
                    nickname: this.userInfo.nickname || '匿名用户',
                    comment: this.comment,
                    position: this.position,
                    contact: this.userInfo.contact,
                    commentTime: Date.now()
                }
                // 更新用户信息，存储到本地
                storageManager.setUserInfo(this.userInfo);
                this.$emit('commentSubmit', comment, commentId, this.commentList);
                this.comment = ''
            },
            voteOrDislikeComment (comment, vote) {
                if (vote) {
                    if (!comment.vote) {
                        voteOrDislikeComment(comment.commentId, vote).then(res => {
                            if (res.data.code === 200) {
                                comment.vote = true;
                                comment.voteCount++;
                                storageManager && storageManager.addVoteCommentId(comment.commentId);
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
                                storageManager && storageManager.removeVoteCommentId(comment.commentId);
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
                                storageManager && storageManager.addDislikeCommentId(comment.commentId);
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
                                storageManager && storageManager.removeDislikeCommentId(comment.commentId);
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
                this.showClose =  true;
            },
            replyPost () {
                this.replyFormFragment.appendChild(this.$refs.addCommentForm);
                this.$refs.commentContainer.insertBefore(this.replyFormFragment, this.$refs.commentList);
                this.showClose = false;
            }
        }
    }
</script>
<style lang="less" scoped>
    @import url('../../assets/css/const.less');
    .comment {
        margin-top: 70px;
    }

    .add_comment {
        margin-top: 40px;
        overflow: hidden;
        padding: 2em 2.5em;
        color: @fontColorDescription;
        background-color: white;
        @media screen and (max-width: 480px){
            font-size: 12px;
            padding: 1.2em 1.5em;
        }
        header {
            overflow: hidden;
            position: relative;

            .icon-close {
                font-size: 20px;
                position: absolute;
                top: 0;
                right: 0;
                cursor: pointer;
                &:hover {
                    color: #e41524;
                }
            }
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
            box-sizing: border-box;
            width: 100%;
            max-width: 300px;
            margin-top: 15px;
            margin-bottom: 20px;
            border: 1px solid #eee;
            padding: 5px 10px;
            font-size: 16px;
            height: 40px;
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

            @media screen and (max-width: 480px){
                font-size: 12px;
                padding: 1.2em 1.5em;
                margin-top:25px;
            }
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
                    @media screen and (max-width: 480px) {
                        font-size: 10px;

                        button {
                            padding: 7px 10px;
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
