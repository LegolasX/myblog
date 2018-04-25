<template>
        <header class="dash_header">
            <div class="user_wrapper">
                <div class="avatar_border"></div>
                <img :src="user.avatar | avatarUrl" alt="" class="avatar">
                <h3>{{user.nickname || '未设置'}}</h3>
                <p>{{user.signature || '这个人很懒，还没有个性签名'}}</p>
            </div>
            <div class="category_wrapper">
                <mu-list>
                    <mu-list-item title="Moments">
                        <span class="icon-instagram" slot="left" style="font-size: 125%"></span>
                        <span slot="right">40</span>
                    </mu-list-item>
                    <mu-list-item title="Article" toggleNested>
                        <span class="icon-paper-plane" slot="left"></span>
                        <div class="second_list" slot="nested">
                            <mu-list-item :class="{active: $route.name === 'createArticle'}" title="发表文章" @click="changeRouter('createArticle')">
                                <span class="icon-paper-plane" slot="left" style="opacity:0"></span>
                            </mu-list-item>
                            <mu-list-item :class="{active: $route.name === 'categoryArticle'}" title="分类管理" @click="changeRouter('categoryArticle')">
                                <span class="icon-paper-plane" slot="left"  style="opacity:0"></span>
                            </mu-list-item>
                            <mu-list-item :class="{active: $route.name === 'articleList'}" title="文章列表" @click="changeRouter('articleList')">
                                <span class="icon-paper-plane" slot="left"  style="opacity:0"></span>
                                <span slot="right">40</span>
                            </mu-list-item>
                        </div>
                    </mu-list-item>
                    <mu-list-item title="Photos" :class="{active: $route.name === 'photos'}"  @click="changeRouter('photos')">
                        <span class="icon-image" slot="left"></span>
                        <span slot="right">34</span>
                    </mu-list-item>
                    <mu-list-item title="Settings" :class="{active: $route.name === 'setting'}"  @click="changeRouter('setting')">
                        <span class="icon-cogs" slot="left"></span>
                        <span slot="right">19</span>
                    </mu-list-item>
                </mu-list>
            </div>
        </header>
</template>
<script>
    import muList from 'muse-ui/src/list/list';
    import muListItem from 'muse-ui/src/list/listItem';
    import {
        CDN_BASE_URL
    } from '../../util/constants'
    import {
        getUserProfile
    } from '../../api/user';

    export default {
        props: {
            tabIndex: {
                default: 0
            }
        },
        data() {
            return {
                inProgress: false,
                user: {

                }
            }
        },
        created () {
            getUserProfile().then(res => {
                this.user = res.data.data;
            })
        },
        methods: {
            changeTab (tabIndex) {
                this.$emit('changeTab', tabIndex);
            },
            changeRouter (name) {
                if (this.$route.name === name) {
                    return void 666;
                } else {
                    this.$router.push({
                        name: name
                    });
                }
            } 
        },
        components: {
            muList,
            muListItem
        }
    }
</script>
<style lang="less">
    .dash_header {
        position: absolute;
        z-index: 2;
        width: 300px;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: white;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05), 0 15px 100px 0 rgba(0, 0, 75, 0.125);
        .user_wrapper {
            color: white;
            text-align: center;
            height: 40%;
            background: linear-gradient(135deg, #daac84 30%, #f3ae99 50%, #e8a28c 75%, #ea8783 100%);
            .avatar_border {
                position: absolute;
                top: 50px;
                left: 50%;
                transform: translate(-50%, 0);
                width: 90px;
                height: 90px;
                border: 1px solid white;
                border-radius: 50%;
            }
            .avatar {
                position: absolute;
                width: 80px;
                height: 80px;
                top: 55px;
                left: 50%;
                transform: translate(-50%, 0);
                border-radius: 50%;
            }
            h3 {
                padding-top: 170px;
                font-size: 16px;
                letter-spacing: 1px;
            }
            p {
                font-size: 14px;
                margin: 10px 40px;
                font-weight: 200;
                letter-spacing: 1px;
            }
        }
        .category_wrapper {
            padding-top: 30px;
        }
    }

    .active {
        .mu-item, .mu-item-left, .mu-item-right {
            color: #ea8783;
        }
    }
</style>
